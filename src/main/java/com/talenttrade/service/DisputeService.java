package com.talenttrade.service;

import com.talenttrade.dto.OtherDtos;
import com.talenttrade.entity.*;
import com.talenttrade.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DisputeService {

    private final DisputeRepository disputeRepository;
    private final ProjectWorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;
    private final WalletService walletService;
    private final NotificationService notificationService;

    public DisputeService(DisputeRepository disputeRepository,
                          ProjectWorkspaceRepository workspaceRepository,
                          UserRepository userRepository,
                          WalletService walletService,
                          NotificationService notificationService) {
        this.disputeRepository = disputeRepository;
        this.workspaceRepository = workspaceRepository;
        this.userRepository = userRepository;
        this.walletService = walletService;
        this.notificationService = notificationService;
    }

    public List<Dispute> getDisputesForUser(Long userId) {
        return disputeRepository.findByInitiatorIdOrRespondentId(userId, userId);
    }

    public List<Dispute> getAllDisputes() {
        return disputeRepository.findAll();
    }

    @Transactional
    public Dispute createDispute(Long initiatorId, OtherDtos.CreateDisputeRequest req) {
        ProjectWorkspace workspace = workspaceRepository.findById(req.getWorkspaceId())
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found"));

        if (!workspace.getClient().getId().equals(initiatorId) && !workspace.getFreelancer().getId().equals(initiatorId)) {
            throw new IllegalArgumentException("Unauthorized to open dispute on this workspace");
        }

        User initiator = userRepository.findById(initiatorId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        User respondent = workspace.getClient().getId().equals(initiatorId) ?
                workspace.getFreelancer() : workspace.getClient();

        Dispute dispute = new Dispute();
        dispute.setWorkspace(workspace);
        dispute.setInitiator(initiator);
        dispute.setRespondent(respondent);
        dispute.setReason(req.getReason().trim());
        dispute.setDescription(req.getDescription().trim());
        dispute.setStatus(Dispute.Status.OPEN);
        dispute = disputeRepository.save(dispute);

        workspace.setStatus(ProjectWorkspace.Status.DISPUTED);
        workspace.setUpdatedAt(LocalDateTime.now());
        workspaceRepository.save(workspace);

        notificationService.sendNotification(
                respondent,
                "Dispute Opened on Workspace",
                initiator.getFullName() + " filed a dispute: " + dispute.getReason() + ". Admin review is pending.",
                "/workspace/" + workspace.getId(),
                "DISPUTE"
        );

        return dispute;
    }

    @Transactional
    public Dispute resolveDispute(Long disputeId, OtherDtos.ResolveDisputeRequest req) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new IllegalArgumentException("Dispute not found"));

        dispute.setStatus(req.getStatus());
        dispute.setAdminResolutionNotes(req.getAdminNotes());
        dispute.setResolvedAt(LocalDateTime.now());

        ProjectWorkspace workspace = dispute.getWorkspace();

        if (req.getStatus() == Dispute.Status.RESOLVED_REFUND_CLIENT) {
            workspace.setStatus(ProjectWorkspace.Status.CANCELLED);
            if (workspace.getEscrowAmount() != null && workspace.getEscrowAmount().compareTo(java.math.BigDecimal.ZERO) > 0) {
                walletService.refundEscrow(
                        workspace.getClient(),
                        workspace.getEscrowAmount(),
                        "DISP-" + dispute.getId(),
                        "Dispute resolved in client favor: Refund"
                );
            }
        } else if (req.getStatus() == Dispute.Status.RESOLVED_PAY_FREELANCER) {
            workspace.setStatus(ProjectWorkspace.Status.COMPLETED);
            if (workspace.getEscrowAmount() != null && workspace.getEscrowAmount().compareTo(java.math.BigDecimal.ZERO) > 0) {
                walletService.releaseEscrow(
                        workspace.getClient(),
                        workspace.getFreelancer(),
                        workspace.getEscrowAmount(),
                        "DISP-" + dispute.getId(),
                        "Dispute resolved in freelancer favor: Payment released"
                );
            }
        } else {
            workspace.setStatus(ProjectWorkspace.Status.ACTIVE);
        }

        workspaceRepository.save(workspace);
        return disputeRepository.save(dispute);
    }
}
