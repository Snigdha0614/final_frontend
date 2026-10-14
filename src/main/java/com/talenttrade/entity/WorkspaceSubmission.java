package com.talenttrade.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workspace_submissions")
public class WorkspaceSubmission {

    public enum Status {
        PENDING_REVIEW,
        APPROVED,
        REVISION_REQUESTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "workspace_id", nullable = false)
    private ProjectWorkspace workspace;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "submitter_id", nullable = false)
    private User submitter;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String submissionNotes;

    @Column(length = 500)
    private String deliverableUrl;

    @Column(length = 200)
    private String deliverableFileName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status = Status.PENDING_REVIEW;

    @Column(columnDefinition = "TEXT")
    private String revisionFeedback;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime reviewedAt;

    public WorkspaceSubmission() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProjectWorkspace getWorkspace() { return workspace; }
    public void setWorkspace(ProjectWorkspace workspace) { this.workspace = workspace; }

    public User getSubmitter() { return submitter; }
    public void setSubmitter(User submitter) { this.submitter = submitter; }

    public String getSubmissionNotes() { return submissionNotes; }
    public void setSubmissionNotes(String submissionNotes) { this.submissionNotes = submissionNotes; }

    public String getDeliverableUrl() { return deliverableUrl; }
    public void setDeliverableUrl(String deliverableUrl) { this.deliverableUrl = deliverableUrl; }

    public String getDeliverableFileName() { return deliverableFileName; }
    public void setDeliverableFileName(String deliverableFileName) { this.deliverableFileName = deliverableFileName; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getRevisionFeedback() { return revisionFeedback; }
    public void setRevisionFeedback(String revisionFeedback) { this.revisionFeedback = revisionFeedback; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
}
