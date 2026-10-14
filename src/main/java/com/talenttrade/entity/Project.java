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
@Table(name = "projects")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Project {

    public enum BudgetType {
        FIXED_PRICE,
        HOURLY,
        SKILL_EXCHANGE
    }

    public enum Status {
        OPEN,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false, length = 100)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private BudgetType budgetType = BudgetType.FIXED_PRICE;

    private BigDecimal fixedBudget;
    private BigDecimal budgetMin;
    private BigDecimal budgetMax;

    private LocalDate deadline;

    @Column(length = 255)
    private String requiredSkills; // comma separated

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status = Status.OPEN;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hired_freelancer_id")
    private User hiredFreelancer;

    private Integer proposalCount = 0;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @JsonIgnore
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProjectProposal> proposals = new ArrayList<>();

    public Project() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BudgetType getBudgetType() { return budgetType; }
    public void setBudgetType(BudgetType budgetType) { this.budgetType = budgetType; }

    public BigDecimal getFixedBudget() { return fixedBudget; }
    public void setFixedBudget(BigDecimal fixedBudget) { this.fixedBudget = fixedBudget; }

    public BigDecimal getBudgetMin() { return budgetMin; }
    public void setBudgetMin(BigDecimal budgetMin) { this.budgetMin = budgetMin; }

    public BigDecimal getBudgetMax() { return budgetMax; }
    public void setBudgetMax(BigDecimal budgetMax) { this.budgetMax = budgetMax; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public User getClient() { return client; }
    public void setClient(User client) { this.client = client; }

    public User getHiredFreelancer() { return hiredFreelancer; }
    public void setHiredFreelancer(User hiredFreelancer) { this.hiredFreelancer = hiredFreelancer; }

    public Integer getProposalCount() { return proposalCount; }
    public void setProposalCount(Integer proposalCount) { this.proposalCount = proposalCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<ProjectProposal> getProposals() { return proposals; }
    public void setProposals(List<ProjectProposal> proposals) { this.proposals = proposals; }
}
