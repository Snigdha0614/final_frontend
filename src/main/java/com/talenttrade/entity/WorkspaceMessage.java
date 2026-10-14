package com.talenttrade.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workspace_messages")
public class WorkspaceMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "workspace_id", nullable = false)
    private ProjectWorkspace workspace;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(length = 500)
    private String attachmentUrl;

    @Column(length = 200)
    private String attachmentName;

    private LocalDateTime createdAt = LocalDateTime.now();

    public WorkspaceMessage() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProjectWorkspace getWorkspace() { return workspace; }
    public void setWorkspace(ProjectWorkspace workspace) { this.workspace = workspace; }

    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }

    public String getAttachmentName() { return attachmentName; }
    public void setAttachmentName(String attachmentName) { this.attachmentName = attachmentName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
