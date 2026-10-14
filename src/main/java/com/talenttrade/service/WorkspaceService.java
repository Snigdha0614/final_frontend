package com.talenttrade.service;

import com.talenttrade.dto.WorkspaceDtos;
import com.talenttrade.entity.*;
import com.talenttrade.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkspaceService {

    private final ProjectWorkspaceRepository workspaceRepository;
    private final WorkspaceTaskRepository taskRepository;
    private final WorkspaceMessageRepository messageRepository;
    private final WorkspaceSubmissionRepository submissionRepository;
    private final ServiceListingRepository serviceRepository;
    private final UserRepository userRepository;
    private final WalletService walletService;
    private final NotificationService notificationService;

    public WorkspaceService(ProjectWorkspaceRepository workspaceRepository,
                            WorkspaceTaskRepository taskRepository,
                            WorkspaceMessageRepository messageRepository,
                            WorkspaceSubmissionRepository submissionRepository,
                            ServiceListingRepository serviceRepository,
                            UserRepository userRepository,
                            WalletService walletService,
                            NotificationService notificationService) {
        this.workspaceRepository = workspaceRepository;
        this.taskRepository = taskRepository;
        this.messageRepository = messageRepository;
        this.submissionRepository = submissionRepository;
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
        this.walletService = walletService;
        this.notificationService = notificationService;
    }

    public List<ProjectWorkspace> getUserWorkspaces(Long userId) {
        return workspaceRepository.findByUserInvolved(userId);
    }

    public ProjectWorkspace getWorkspaceById(Long id, Long userId) {
        ProjectWorkspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found with id: " + id));

        if (!workspace.getClient().getId().equals(userId) && !workspace.getFreelancer().getId().equals(userId)) {
            User current = userRepository.findById(userId).orElse(null);
            if (current == null || current.getRole() != Role.ROLE_ADMIN) {
                throw new IllegalArgumentException("Unauthorized to access this workspace");
            }
        }
        return workspace;
    }

    @Transactional
    public ProjectWorkspace orderServiceDirect(Long serviceId, Long clientId) {
        ServiceListing service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new IllegalArgumentException("Service listing not found"));
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Client not found"));

        if (service.getSeller().getId().equals(clientId)) {
            throw new IllegalArgumentException("You cannot order your own service");
        }

        // Hold Escrow
        walletService.holdEscrow(
                client,
                service.getPrice(),
                "SRV-" + service.getId() + "-" + System.currentTimeMillis(),
                "Direct Order: " + service.getTitle()
        );

        ProjectWorkspace workspace = new ProjectWorkspace();
        workspace.setTitle("Service: " + service.getTitle());
        workspace.setWorkspaceType(ProjectWorkspace.WorkspaceType.SERVICE_ORDER);
        workspace.setClient(client);
        workspace.setFreelancer(service.getSeller());
        workspace.setServiceListing(service);
        workspace.setStatus(ProjectWorkspace.Status.ACTIVE);
        workspace.setProgressPercent(0);
        workspace.setEscrowAmount(service.getPrice());
        workspace = workspaceRepository.save(workspace);

        // Pre-create initial milestone task
        WorkspaceTask task = new WorkspaceTask();
        task.setWorkspace(workspace);
        task.setTitle("Service Delivery: " + service.getTitle());
        task.setDescription("Deliverable according to service specifications.");
        task.setAssignedTo(service.getSeller());
        task.setStatus(WorkspaceTask.Status.IN_PROGRESS);
        taskRepository.save(task);

        notificationService.sendNotification(
                service.getSeller(),
                "New Order Received! 🚀",
                client.getFullName() + " ordered your service: " + service.getTitle(),
                "/workspace/" + workspace.getId(),
                "WORKSPACE"
        );

        return workspace;
    }

    @Transactional
    public WorkspaceTask createTask(Long workspaceId, WorkspaceDtos.CreateTaskRequest req, Long userId) {
        ProjectWorkspace workspace = getWorkspaceById(workspaceId, userId);

        WorkspaceTask task = new WorkspaceTask();
        task.setWorkspace(workspace);
        task.setTitle(req.getTitle().trim());
        task.setDescription(req.getDescription());
        task.setStatus(WorkspaceTask.Status.TODO);
        task.setDueDate(req.getDueDate());

        if (req.getAssignedToId() != null) {
            userRepository.findById(req.getAssignedToId()).ifPresent(task::setAssignedTo);
        } else {
            task.setAssignedTo(workspace.getFreelancer());
        }

        return taskRepository.save(task);
    }

    @Transactional
    public WorkspaceTask updateTaskStatus(Long taskId, WorkspaceTask.Status newStatus, Long userId) {
        WorkspaceTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        // verify access
        getWorkspaceById(task.getWorkspace().getId(), userId);

        task.setStatus(newStatus);
        taskRepository.save(task);

        // Recalculate workspace progress automatically
        List<WorkspaceTask> tasks = taskRepository.findByWorkspaceIdOrderByCreatedAtAsc(task.getWorkspace().getId());
        if (!tasks.isEmpty()) {
            long doneCount = tasks.stream().filter(t -> t.getStatus() == WorkspaceTask.Status.DONE).count();
            int percent = (int) Math.round(((double) doneCount / tasks.size()) * 100);
            ProjectWorkspace ws = task.getWorkspace();
            ws.setProgressPercent(percent);
            ws.setUpdatedAt(LocalDateTime.now());
            workspaceRepository.save(ws);
        }

        return task;
    }

    public List<WorkspaceTask> getTasks(Long workspaceId, Long userId) {
        getWorkspaceById(workspaceId, userId);
        return taskRepository.findByWorkspaceIdOrderByCreatedAtAsc(workspaceId);
    }

    @Transactional
    public WorkspaceMessage sendMessage(Long workspaceId, WorkspaceDtos.SendMessageRequest req, Long userId) {
        ProjectWorkspace workspace = getWorkspaceById(workspaceId, userId);
        User sender = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        WorkspaceMessage message = new WorkspaceMessage();
        message.setWorkspace(workspace);
        message.setSender(sender);
        message.setMessage(req.getMessage().trim());
        message.setAttachmentUrl(req.getAttachmentUrl());
        message.setAttachmentName(req.getAttachmentName());
        message = messageRepository.save(message);

        workspace.setUpdatedAt(LocalDateTime.now());
        workspaceRepository.save(workspace);

        User partner = workspace.getClient().getId().equals(userId) ? workspace.getFreelancer() : workspace.getClient();
        notificationService.sendNotification(
                partner,
                "New message in " + workspace.getTitle(),
                sender.getFullName() + ": " + (message.getMessage().length() > 60 ? message.getMessage().substring(0, 57) + "..." : message.getMessage()),
                "/workspace/" + workspace.getId(),
                "MESSAGE"
        );

        return message;
    }

    public List<WorkspaceMessage> getMessages(Long workspaceId, Long userId) {
        getWorkspaceById(workspaceId, userId);
        return messageRepository.findByWorkspaceIdOrderByCreatedAtAsc(workspaceId);
    }

    @Transactional
    public WorkspaceSubmission submitWork(Long workspaceId, WorkspaceDtos.SubmitWorkRequest req, Long userId) {
        ProjectWorkspace workspace = getWorkspaceById(workspaceId, userId);
        User submitter = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        WorkspaceSubmission submission = new WorkspaceSubmission();
        submission.setWorkspace(workspace);
        submission.setSubmitter(submitter);
        submission.setSubmissionNotes(req.getSubmissionNotes().trim());
        submission.setDeliverableUrl(req.getDeliverableUrl());
        submission.setDeliverableFileName(req.getDeliverableFileName() != null ? req.getDeliverableFileName() : "Deliverables_Package.zip");
        submission.setStatus(WorkspaceSubmission.Status.PENDING_REVIEW);
        submission = submissionRepository.save(submission);

        workspace.setStatus(ProjectWorkspace.Status.SUBMITTED);
        workspace.setProgressPercent(95);
        workspace.setUpdatedAt(LocalDateTime.now());
        workspaceRepository.save(workspace);

        User notifyTarget = workspace.getClient().getId().equals(userId) ? workspace.getFreelancer() : workspace.getClient();
        notificationService.sendNotification(
                notifyTarget,
                "Work Submitted for Review",
                submitter.getFullName() + " submitted deliverables for '" + workspace.getTitle() + "'. Please review.",
                "/workspace/" + workspace.getId(),
                "WORKSPACE"
        );

        return submission;
    }

    public List<WorkspaceSubmission> getSubmissions(Long workspaceId, Long userId) {
        getWorkspaceById(workspaceId, userId);
        return submissionRepository.findByWorkspaceIdOrderByCreatedAtDesc(workspaceId);
    }

    @Transactional
    public WorkspaceSubmission reviewSubmission(Long workspaceId, Long submissionId, WorkspaceDtos.ReviewWorkRequest req, Long userId) {
        ProjectWorkspace workspace = getWorkspaceById(workspaceId, userId);
        WorkspaceSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));

        submission.setReviewedAt(LocalDateTime.now());

        if (req.isApproved()) {
            submission.setStatus(WorkspaceSubmission.Status.APPROVED);
            workspace.setStatus(ProjectWorkspace.Status.COMPLETED);
            workspace.setProgressPercent(100);

            // Release escrow to freelancer
            if (workspace.getEscrowAmount() != null && workspace.getEscrowAmount().compareTo(java.math.BigDecimal.ZERO) > 0) {
                walletService.releaseEscrow(
                        workspace.getClient(),
                        workspace.getFreelancer(),
                        workspace.getEscrowAmount(),
                        "WS-" + workspace.getId(),
                        "Completed contract: " + workspace.getTitle()
                );
            }

            notificationService.sendNotification(
                    workspace.getFreelancer(),
                    "Work Approved! Payment Released 🎉",
                    "Your submission for '" + workspace.getTitle() + "' was approved and funds have been credited to your wallet.",
                    "/workspace/" + workspace.getId(),
                    "PAYMENT"
            );
        } else {
            submission.setStatus(WorkspaceSubmission.Status.REVISION_REQUESTED);
            submission.setRevisionFeedback(req.getRevisionFeedback());
            workspace.setStatus(ProjectWorkspace.Status.IN_REVISION);

            notificationService.sendNotification(
                    workspace.getFreelancer(),
                    "Revision Requested",
                    "Revision requested on '" + workspace.getTitle() + "': " + req.getRevisionFeedback(),
                    "/workspace/" + workspace.getId(),
                    "WORKSPACE"
            );
        }

        submissionRepository.save(submission);
        workspace.setUpdatedAt(LocalDateTime.now());
        workspaceRepository.save(workspace);

        return submission;
    }

    @Transactional
    public ProjectWorkspace updateProgress(Long workspaceId, Integer percent, Long userId) {
        ProjectWorkspace workspace = getWorkspaceById(workspaceId, userId);
        workspace.setProgressPercent(Math.min(100, Math.max(0, percent)));
        workspace.setUpdatedAt(LocalDateTime.now());
        return workspaceRepository.save(workspace);
    }
}
