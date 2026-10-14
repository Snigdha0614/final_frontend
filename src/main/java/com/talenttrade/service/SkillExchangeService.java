package com.talenttrade.service;

import com.talenttrade.dto.ExchangeDtos;
import com.talenttrade.entity.*;
import com.talenttrade.repository.ExchangeCounterOfferRepository;
import com.talenttrade.repository.ProjectWorkspaceRepository;
import com.talenttrade.repository.SkillExchangeRepository;
import com.talenttrade.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SkillExchangeService {

    private final SkillExchangeRepository exchangeRepository;
    private final ExchangeCounterOfferRepository counterOfferRepository;
    private final ProjectWorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;
    private final WalletService walletService;
    private final NotificationService notificationService;

    public SkillExchangeService(SkillExchangeRepository exchangeRepository,
                                ExchangeCounterOfferRepository counterOfferRepository,
                                ProjectWorkspaceRepository workspaceRepository,
                                UserRepository userRepository,
                                WalletService walletService,
                                NotificationService notificationService) {
        this.exchangeRepository = exchangeRepository;
        this.counterOfferRepository = counterOfferRepository;
        this.workspaceRepository = workspaceRepository;
        this.userRepository = userRepository;
        this.walletService = walletService;
        this.notificationService = notificationService;
    }

    public List<SkillExchange> getUserExchanges(Long userId) {
        return exchangeRepository.findByUserInvolved(userId);
    }

    public SkillExchange getExchangeById(Long id) {
        return exchangeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Skill exchange not found with id: " + id));
    }

    public List<SkillExchange> filterExchanges(SkillExchange.Status status, SkillExchange.ExchangeType type, String search) {
        return exchangeRepository.filterExchanges(status, type, search);
    }

    @Transactional
    public SkillExchange createExchange(Long initiatorId, ExchangeDtos.CreateExchangeRequest req) {
        if (initiatorId.equals(req.getReceiverId())) {
            throw new IllegalArgumentException("Cannot propose a skill exchange to yourself");
        }

        User initiator = userRepository.findById(initiatorId)
                .orElseThrow(() -> new IllegalArgumentException("Initiator not found"));
        User receiver = userRepository.findById(req.getReceiverId())
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

        SkillExchange exchange = new SkillExchange();
        exchange.setInitiator(initiator);
        exchange.setReceiver(receiver);
        exchange.setExchangeType(req.getExchangeType());
        exchange.setOfferedSkillTitle(req.getOfferedSkillTitle().trim());
        exchange.setOfferedSkillDescription(req.getOfferedSkillDescription());
        exchange.setRequestedSkillTitle(req.getRequestedSkillTitle().trim());
        exchange.setRequestedSkillDescription(req.getRequestedSkillDescription());
        exchange.setCashCompensation(req.getCashCompensation() != null ? req.getCashCompensation() : BigDecimal.ZERO);
        exchange.setCompensationPayer(req.getCompensationPayer() != null ? req.getCompensationPayer() : SkillExchange.CompensationPayer.NONE);
        exchange.setTermsNote(req.getTermsNote());
        exchange.setDeadline(req.getDeadline());
        exchange.setStatus(SkillExchange.Status.PENDING);

        exchange = exchangeRepository.save(exchange);

        notificationService.sendNotification(
                receiver,
                "New Skill Exchange Proposal! 🤝",
                initiator.getFullName() + " proposed a trade: " + exchange.getOfferedSkillTitle() + " for " + exchange.getRequestedSkillTitle(),
                "/exchanges/" + exchange.getId(),
                "EXCHANGE"
        );

        return exchange;
    }

    @Transactional
    public ExchangeCounterOffer submitCounterOffer(Long exchangeId, Long proposerId, ExchangeDtos.CounterOfferRequest req) {
        SkillExchange exchange = getExchangeById(exchangeId);
        User proposer = userRepository.findById(proposerId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!exchange.getInitiator().getId().equals(proposerId) && !exchange.getReceiver().getId().equals(proposerId)) {
            throw new IllegalArgumentException("Unauthorized to submit counteroffer on this exchange");
        }

        ExchangeCounterOffer counter = new ExchangeCounterOffer();
        counter.setSkillExchange(exchange);
        counter.setProposer(proposer);
        counter.setCounterOfferedSkill(req.getCounterOfferedSkill().trim());
        counter.setCounterRequestedSkill(req.getCounterRequestedSkill().trim());
        counter.setCounterCashCompensation(req.getCounterCashCompensation() != null ? req.getCounterCashCompensation() : BigDecimal.ZERO);
        counter.setCounterCompensationPayer(req.getCounterCompensationPayer());
        counter.setNote(req.getNote());
        counter = counterOfferRepository.save(counter);

        // Update exchange status
        exchange.setStatus(SkillExchange.Status.COUNTERED);
        exchange.setUpdatedAt(LocalDateTime.now());
        exchangeRepository.save(exchange);

        User notifyTarget = exchange.getInitiator().getId().equals(proposerId) ? exchange.getReceiver() : exchange.getInitiator();
        notificationService.sendNotification(
                notifyTarget,
                "Counteroffer on Skill Exchange",
                proposer.getFullName() + " submitted a counteroffer for the skill exchange.",
                "/exchanges/" + exchange.getId(),
                "EXCHANGE"
        );

        return counter;
    }

    public List<ExchangeCounterOffer> getCounterOffers(Long exchangeId) {
        return counterOfferRepository.findBySkillExchangeIdOrderByCreatedAtDesc(exchangeId);
    }

    @Transactional
    public ProjectWorkspace acceptExchange(Long exchangeId, Long userId) {
        SkillExchange exchange = getExchangeById(exchangeId);

        if (!exchange.getInitiator().getId().equals(userId) && !exchange.getReceiver().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized to accept this exchange");
        }

        exchange.setStatus(SkillExchange.Status.ACCEPTED);
        exchange.setUpdatedAt(LocalDateTime.now());

        // Handle escrow if cash compensation is involved
        BigDecimal compensation = exchange.getCashCompensation();
        if (compensation != null && compensation.compareTo(BigDecimal.ZERO) > 0) {
            User payer = exchange.getCompensationPayer() == SkillExchange.CompensationPayer.INITIATOR ?
                    exchange.getInitiator() : exchange.getReceiver();
            walletService.holdEscrow(
                    payer,
                    compensation,
                    "EXCH-" + exchange.getId(),
                    "Skill Exchange Cash Compensation (" + exchange.getOfferedSkillTitle() + " <-> " + exchange.getRequestedSkillTitle() + ")"
            );
        }

        // Create collaborative Project Workspace for both parties
        ProjectWorkspace workspace = new ProjectWorkspace();
        workspace.setTitle("Exchange: " + exchange.getOfferedSkillTitle() + " ⇄ " + exchange.getRequestedSkillTitle());
        workspace.setWorkspaceType(ProjectWorkspace.WorkspaceType.SKILL_EXCHANGE);
        workspace.setClient(exchange.getInitiator());
        workspace.setFreelancer(exchange.getReceiver());
        workspace.setSkillExchange(exchange);
        workspace.setStatus(ProjectWorkspace.Status.ACTIVE);
        workspace.setProgressPercent(0);
        workspace.setEscrowAmount(compensation != null ? compensation : BigDecimal.ZERO);
        workspace = workspaceRepository.save(workspace);

        exchange.setWorkspaceId(workspace.getId());
        exchangeRepository.save(exchange);

        User partner = exchange.getInitiator().getId().equals(userId) ? exchange.getReceiver() : exchange.getInitiator();
        notificationService.sendNotification(
                partner,
                "Skill Exchange Accepted! 🎉",
                "Your skill exchange was accepted! Your shared workspace is now open.",
                "/workspace/" + workspace.getId(),
                "WORKSPACE"
        );

        return workspace;
    }

    @Transactional
    public void rejectExchange(Long exchangeId, Long userId) {
        SkillExchange exchange = getExchangeById(exchangeId);
        if (!exchange.getInitiator().getId().equals(userId) && !exchange.getReceiver().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized");
        }
        exchange.setStatus(SkillExchange.Status.REJECTED);
        exchange.setUpdatedAt(LocalDateTime.now());
        exchangeRepository.save(exchange);
    }

    @Transactional
    public void completeExchange(Long exchangeId, Long userId) {
        SkillExchange exchange = getExchangeById(exchangeId);
        if (!exchange.getInitiator().getId().equals(userId) && !exchange.getReceiver().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized");
        }

        exchange.setStatus(SkillExchange.Status.COMPLETED);
        exchange.setUpdatedAt(LocalDateTime.now());
        exchangeRepository.save(exchange);

        // If escrow was held, release to payee
        BigDecimal compensation = exchange.getCashCompensation();
        if (compensation != null && compensation.compareTo(BigDecimal.ZERO) > 0) {
            User payer = exchange.getCompensationPayer() == SkillExchange.CompensationPayer.INITIATOR ?
                    exchange.getInitiator() : exchange.getReceiver();
            User payee = exchange.getCompensationPayer() == SkillExchange.CompensationPayer.INITIATOR ?
                    exchange.getReceiver() : exchange.getInitiator();

            walletService.releaseEscrow(
                    payer,
                    payee,
                    compensation,
                    "EXCH-" + exchange.getId(),
                    "Skill Exchange Completed"
            );
        }
    }
}
