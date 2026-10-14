package com.talenttrade.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_proposals")
public class ProjectProposal {

    public enum Status {
        PENDING,
        ACCEPTED,
        REJECTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "freelancer_id", nullable = false)
    private User freelancer;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String coverLetter;

    private BigDecimal bidAmount;

    private Integer deliveryDays;

    @Column(length = 200)
    private String offeredSkill; // For skill exchange proposals

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();

    public ProjectProposal() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public User getFreelancer() { return freelancer; }
    public void setFreelancer(User freelancer) { this.freelancer = freelancer; }

    public String getCoverLetter() { return coverLetter; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }

    public BigDecimal getBidAmount() { return bidAmount; }
    public void setBidAmount(BigDecimal bidAmount) { this.bidAmount = bidAmount; }

    public Integer getDeliveryDays() { return deliveryDays; }
    public void setDeliveryDays(Integer deliveryDays) { this.deliveryDays = deliveryDays; }

    public String getOfferedSkill() { return offeredSkill; }
    public void setOfferedSkill(String offeredSkill) { this.offeredSkill = offeredSkill; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
