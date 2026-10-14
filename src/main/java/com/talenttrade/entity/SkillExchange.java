package com.talenttrade.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "skill_exchanges")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class SkillExchange {

    public enum ExchangeType {
        FREE_SKILL_EXCHANGE,      // Pure 1-to-1 skill barter
        HYBRID_WITH_PAYMENT,      // Skill exchange + partial cash compensation
        PAID_SERVICE_SWAP         // Cross-commission with agreed fee
    }

    public enum Status {
        PENDING,
        COUNTERED,
        ACCEPTED,
        REJECTED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }

    public enum CompensationPayer {
        INITIATOR,
        RECEIVER,
        NONE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "initiator_id", nullable = false)
    private User initiator;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ExchangeType exchangeType = ExchangeType.FREE_SKILL_EXCHANGE;

    @Column(nullable = false, length = 200)
    private String offeredSkillTitle;

    @Column(columnDefinition = "TEXT")
    private String offeredSkillDescription;

    @Column(nullable = false, length = 200)
    private String requestedSkillTitle;

    @Column(columnDefinition = "TEXT")
    private String requestedSkillDescription;

    private BigDecimal cashCompensation = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CompensationPayer compensationPayer = CompensationPayer.NONE;

    @Column(columnDefinition = "TEXT")
    private String termsNote;

    private LocalDate deadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.PENDING;

    private Long workspaceId;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @JsonIgnore
    @OneToMany(mappedBy = "skillExchange", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ExchangeCounterOffer> counterOffers = new ArrayList<>();

    public SkillExchange() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getInitiator() { return initiator; }
    public void setInitiator(User initiator) { this.initiator = initiator; }

    public User getReceiver() { return receiver; }
    public void setReceiver(User receiver) { this.receiver = receiver; }

    public ExchangeType getExchangeType() { return exchangeType; }
    public void setExchangeType(ExchangeType exchangeType) { this.exchangeType = exchangeType; }

    public String getOfferedSkillTitle() { return offeredSkillTitle; }
    public void setOfferedSkillTitle(String offeredSkillTitle) { this.offeredSkillTitle = offeredSkillTitle; }

    public String getOfferedSkillDescription() { return offeredSkillDescription; }
    public void setOfferedSkillDescription(String offeredSkillDescription) { this.offeredSkillDescription = offeredSkillDescription; }

    public String getRequestedSkillTitle() { return requestedSkillTitle; }
    public void setRequestedSkillTitle(String requestedSkillTitle) { this.requestedSkillTitle = requestedSkillTitle; }

    public String getRequestedSkillDescription() { return requestedSkillDescription; }
    public void setRequestedSkillDescription(String requestedSkillDescription) { this.requestedSkillDescription = requestedSkillDescription; }

    public BigDecimal getCashCompensation() { return cashCompensation; }
    public void setCashCompensation(BigDecimal cashCompensation) { this.cashCompensation = cashCompensation; }

    public CompensationPayer getCompensationPayer() { return compensationPayer; }
    public void setCompensationPayer(CompensationPayer compensationPayer) { this.compensationPayer = compensationPayer; }

    public String getTermsNote() { return termsNote; }
    public void setTermsNote(String termsNote) { this.termsNote = termsNote; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Long getWorkspaceId() { return workspaceId; }
    public void setWorkspaceId(Long workspaceId) { this.workspaceId = workspaceId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<ExchangeCounterOffer> getCounterOffers() { return counterOffers; }
    public void setCounterOffers(List<ExchangeCounterOffer> counterOffers) { this.counterOffers = counterOffers; }
}
