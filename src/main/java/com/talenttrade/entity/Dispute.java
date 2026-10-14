package com.talenttrade.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "disputes")
public class Dispute {

    public enum Status {
        OPEN,
        RESOLVED_REFUND_CLIENT,
        RESOLVED_PAY_FREELANCER,
        DISMISSED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "workspace_id", nullable = false)
    private ProjectWorkspace workspace;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "initiator_id", nullable = false)
    private User initiator;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "respondent_id", nullable = false)
    private User respondent;

    @Column(nullable = false, length = 150)
    private String reason; // Non-delivery, Poor Quality, Incomplete Scope, Unresponsive

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status = Status.OPEN;

    @Column(columnDefinition = "TEXT")
    private String adminResolutionNotes;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime resolvedAt;

    public Dispute() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProjectWorkspace getWorkspace() { return workspace; }
    public void setWorkspace(ProjectWorkspace workspace) { this.workspace = workspace; }

    public User getInitiator() { return initiator; }
    public void setInitiator(User initiator) { this.initiator = initiator; }

    public User getRespondent() { return respondent; }
    public void setRespondent(User respondent) { this.respondent = respondent; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getAdminResolutionNotes() { return adminResolutionNotes; }
    public void setAdminResolutionNotes(String adminResolutionNotes) { this.adminResolutionNotes = adminResolutionNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
