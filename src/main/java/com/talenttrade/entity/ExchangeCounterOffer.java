package com.talenttrade.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "exchange_counter_offers")
public class ExchangeCounterOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_exchange_id", nullable = false)
    private SkillExchange skillExchange;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "proposer_id", nullable = false)
    private User proposer;

    @Column(nullable = false, length = 200)
    private String counterOfferedSkill;

    @Column(nullable = false, length = 200)
    private String counterRequestedSkill;

    private BigDecimal counterCashCompensation = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private SkillExchange.CompensationPayer counterCompensationPayer = SkillExchange.CompensationPayer.NONE;

    @Column(columnDefinition = "TEXT")
    private String note;

    private LocalDateTime createdAt = LocalDateTime.now();

    public ExchangeCounterOffer() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public SkillExchange getSkillExchange() { return skillExchange; }
    public void setSkillExchange(SkillExchange skillExchange) { this.skillExchange = skillExchange; }

    public User getProposer() { return proposer; }
    public void setProposer(User proposer) { this.proposer = proposer; }

    public String getCounterOfferedSkill() { return counterOfferedSkill; }
    public void setCounterOfferedSkill(String counterOfferedSkill) { this.counterOfferedSkill = counterOfferedSkill; }

    public String getCounterRequestedSkill() { return counterRequestedSkill; }
    public void setCounterRequestedSkill(String counterRequestedSkill) { this.counterRequestedSkill = counterRequestedSkill; }

    public BigDecimal getCounterCashCompensation() { return counterCashCompensation; }
    public void setCounterCashCompensation(BigDecimal counterCashCompensation) { this.counterCashCompensation = counterCashCompensation; }

    public SkillExchange.CompensationPayer getCounterCompensationPayer() { return counterCompensationPayer; }
    public void setCounterCompensationPayer(SkillExchange.CompensationPayer counterCompensationPayer) { this.counterCompensationPayer = counterCompensationPayer; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
