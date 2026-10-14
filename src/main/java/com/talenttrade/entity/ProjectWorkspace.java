package com.talenttrade.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workspaces")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ProjectWorkspace {

    public enum WorkspaceType {
        PROJECT_CONTRACT,
        SERVICE_ORDER,
        SKILL_EXCHANGE
    }

    public enum Status {
        ACTIVE,
        SUBMITTED,
        IN_REVISION,
        COMPLETED,
        DISPUTED,
        CANCELLED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private WorkspaceType workspaceType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "freelancer_id", nullable = false)
    private User freelancer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_id")
    private ServiceListing serviceListing;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_exchange_id")
    private SkillExchange skillExchange;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status = Status.ACTIVE;

    private Integer progressPercent = 0;

    private BigDecimal escrowAmount = BigDecimal.ZERO;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @JsonIgnore
    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<WorkspaceTask> tasks = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<WorkspaceMessage> messages = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<WorkspaceSubmission> submissions = new ArrayList<>();

    public ProjectWorkspace() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public WorkspaceType getWorkspaceType() { return workspaceType; }
    public void setWorkspaceType(WorkspaceType workspaceType) { this.workspaceType = workspaceType; }

    public User getClient() { return client; }
    public void setClient(User client) { this.client = client; }

    public User getFreelancer() { return freelancer; }
    public void setFreelancer(User freelancer) { this.freelancer = freelancer; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public ServiceListing getServiceListing() { return serviceListing; }
    public void setServiceListing(ServiceListing serviceListing) { this.serviceListing = serviceListing; }

    public SkillExchange getSkillExchange() { return skillExchange; }
    public void setSkillExchange(SkillExchange skillExchange) { this.skillExchange = skillExchange; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Integer getProgressPercent() { return progressPercent; }
    public void setProgressPercent(Integer progressPercent) { this.progressPercent = progressPercent; }

    public BigDecimal getEscrowAmount() { return escrowAmount; }
    public void setEscrowAmount(BigDecimal escrowAmount) { this.escrowAmount = escrowAmount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<WorkspaceTask> getTasks() { return tasks; }
    public void setTasks(List<WorkspaceTask> tasks) { this.tasks = tasks; }

    public List<WorkspaceMessage> getMessages() { return messages; }
    public void setMessages(List<WorkspaceMessage> messages) { this.messages = messages; }

    public List<WorkspaceSubmission> getSubmissions() { return submissions; }
    public void setSubmissions(List<WorkspaceSubmission> submissions) { this.submissions = submissions; }
}
