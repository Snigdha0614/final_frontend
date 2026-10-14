package com.talenttrade.service;

import com.talenttrade.dto.ProjectDtos;
import com.talenttrade.entity.*;
import com.talenttrade.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectProposalRepository proposalRepository;
    private final ProjectWorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;
    private final WalletService walletService;
    private final NotificationService notificationService;

    public ProjectService(ProjectRepository projectRepository,
                          ProjectProposalRepository proposalRepository,
                          ProjectWorkspaceRepository workspaceRepository,
                          UserRepository userRepository,
                          WalletService walletService,
                          NotificationService notificationService) {
        this.projectRepository = projectRepository;
        this.proposalRepository = proposalRepository;
        this.workspaceRepository = workspaceRepository;
        this.userRepository = userRepository;
        this.walletService = walletService;
        this.notificationService = notificationService;
    }

    public List<Project> filterProjects(String category, Project.BudgetType budgetType, Project.Status status, String search) {
        return projectRepository.filterProjects(category, budgetType, status, search);
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with id: " + id));
    }

    public List<String> getCategories() {
        return projectRepository.findDistinctCategories();
    }

    public List<Project> getClientProjects(Long clientId) {
        return projectRepository.findByClientId(clientId);
    }

    @Transactional
    public Project createProject(Long clientId, ProjectDtos.CreateProjectRequest req) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Client not found"));

        Project project = new Project();
        project.setTitle(req.getTitle().trim());
        project.setDescription(req.getDescription().trim());
        project.setCategory(req.getCategory().trim());
        project.setBudgetType(req.getBudgetType());
        project.setFixedBudget(req.getFixedBudget());
        project.setBudgetMin(req.getBudgetMin());
        project.setBudgetMax(req.getBudgetMax());
        project.setDeadline(req.getDeadline());
        project.setRequiredSkills(req.getRequiredSkills());
        project.setClient(client);
        project.setStatus(Project.Status.OPEN);

        return projectRepository.save(project);
    }

    @Transactional
    public ProjectProposal submitProposal(Long projectId, Long freelancerId, ProjectDtos.SubmitProposalRequest req) {
        Project project = getProjectById(projectId);
        if (project.getStatus() != Project.Status.OPEN) {
            throw new IllegalStateException("Project is not accepting proposals");
        }
        if (project.getClient().getId().equals(freelancerId)) {
            throw new IllegalArgumentException("Clients cannot submit proposals to their own project");
        }

        User freelancer = userRepository.findById(freelancerId)
                .orElseThrow(() -> new IllegalArgumentException("Freelancer not found"));

        if (proposalRepository.existsByProjectIdAndFreelancerId(projectId, freelancerId)) {
            throw new IllegalStateException("You have already submitted a proposal for this project");
        }

        ProjectProposal proposal = new ProjectProposal();
        proposal.setProject(project);
        proposal.setFreelancer(freelancer);
        proposal.setCoverLetter(req.getCoverLetter().trim());
        proposal.setBidAmount(req.getBidAmount());
        proposal.setDeliveryDays(req.getDeliveryDays());
        proposal.setOfferedSkill(req.getOfferedSkill());
        proposal.setStatus(ProjectProposal.Status.PENDING);
        proposal = proposalRepository.save(proposal);

        project.setProposalCount(project.getProposalCount() + 1);
        projectRepository.save(project);

        notificationService.sendNotification(
                project.getClient(),
                "New Proposal Received",
                freelancer.getFullName() + " submitted a proposal for '" + project.getTitle() + "'",
                "/projects/" + project.getId(),
                "PROPOSAL"
        );

        return proposal;
    }

    public List<ProjectProposal> getProjectProposals(Long projectId, Long userId) {
        getProjectById(projectId);
        // Only project owner or admin or individual applicant can see
        return proposalRepository.findByProjectId(projectId);
    }

    @Transactional
    public ProjectWorkspace acceptProposal(Long projectId, Long proposalId, Long clientId) {
        Project project = getProjectById(projectId);
        if (!project.getClient().getId().equals(clientId)) {
            throw new IllegalArgumentException("Unauthorized to accept proposals for this project");
        }

        ProjectProposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new IllegalArgumentException("Proposal not found"));

        if (!proposal.getProject().getId().equals(projectId)) {
            throw new IllegalArgumentException("Proposal does not belong to this project");
        }

        proposal.setStatus(ProjectProposal.Status.ACCEPTED);
        proposalRepository.save(proposal);

        project.setStatus(Project.Status.IN_PROGRESS);
        project.setHiredFreelancer(proposal.getFreelancer());
        project.setUpdatedAt(LocalDateTime.now());
        projectRepository.save(project);

        BigDecimal agreedAmount = proposal.getBidAmount() != null ? proposal.getBidAmount() :
                (project.getFixedBudget() != null ? project.getFixedBudget() : BigDecimal.ZERO);

        // Hold escrow if funded
        if (agreedAmount.compareTo(BigDecimal.ZERO) > 0) {
            walletService.holdEscrow(
                    project.getClient(),
                    agreedAmount,
                    "PROJ-" + project.getId(),
                    "Project Escrow for '" + project.getTitle() + "'"
            );
        }

        // Create Project Workspace
        ProjectWorkspace workspace = new ProjectWorkspace();
        workspace.setTitle("Project: " + project.getTitle());
        workspace.setWorkspaceType(ProjectWorkspace.WorkspaceType.PROJECT_CONTRACT);
        workspace.setClient(project.getClient());
        workspace.setFreelancer(proposal.getFreelancer());
        workspace.setProject(project);
        workspace.setStatus(ProjectWorkspace.Status.ACTIVE);
        workspace.setProgressPercent(0);
        workspace.setEscrowAmount(agreedAmount);
        workspace = workspaceRepository.save(workspace);

        notificationService.sendNotification(
                proposal.getFreelancer(),
                "Proposal Accepted! 🎉",
                "Your proposal for '" + project.getTitle() + "' was accepted. You can now access your project workspace.",
                "/workspace/" + workspace.getId(),
                "WORKSPACE"
        );

        return workspace;
    }

    @Transactional
    public void rejectProposal(Long projectId, Long proposalId, Long clientId) {
        Project project = getProjectById(projectId);
        if (!project.getClient().getId().equals(clientId)) {
            throw new IllegalArgumentException("Unauthorized");
        }
        ProjectProposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new IllegalArgumentException("Proposal not found"));
        proposal.setStatus(ProjectProposal.Status.REJECTED);
        proposalRepository.save(proposal);
    }
}
