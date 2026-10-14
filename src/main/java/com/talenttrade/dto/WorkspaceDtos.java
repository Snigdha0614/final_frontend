package com.talenttrade.dto;

import com.talenttrade.entity.WorkspaceTask;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class WorkspaceDtos {

    public static class CreateTaskRequest {
        @NotBlank(message = "Title is required")
        private String title;
        private String description;
        private Long assignedToId;
        private LocalDate dueDate;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public Long getAssignedToId() { return assignedToId; }
        public void setAssignedToId(Long assignedToId) { this.assignedToId = assignedToId; }
        public LocalDate getDueDate() { return dueDate; }
        public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    }

    public static class UpdateTaskStatusRequest {
        private WorkspaceTask.Status status;

        public WorkspaceTask.Status getStatus() { return status; }
        public void setStatus(WorkspaceTask.Status status) { this.status = status; }
    }

    public static class SendMessageRequest {
        @NotBlank(message = "Message text is required")
        private String message;
        private String attachmentUrl;
        private String attachmentName;

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getAttachmentUrl() { return attachmentUrl; }
        public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }
        public String getAttachmentName() { return attachmentName; }
        public void setAttachmentName(String attachmentName) { this.attachmentName = attachmentName; }
    }

    public static class SubmitWorkRequest {
        @NotBlank(message = "Submission notes are required")
        private String submissionNotes;
        private String deliverableUrl;
        private String deliverableFileName;

        public String getSubmissionNotes() { return submissionNotes; }
        public void setSubmissionNotes(String submissionNotes) { this.submissionNotes = submissionNotes; }
        public String getDeliverableUrl() { return deliverableUrl; }
        public void setDeliverableUrl(String deliverableUrl) { this.deliverableUrl = deliverableUrl; }
        public String getDeliverableFileName() { return deliverableFileName; }
        public void setDeliverableFileName(String deliverableFileName) { this.deliverableFileName = deliverableFileName; }
    }

    public static class ReviewWorkRequest {
        private boolean approved;
        private String revisionFeedback;

        public boolean isApproved() { return approved; }
        public void setApproved(boolean approved) { this.approved = approved; }
        public String getRevisionFeedback() { return revisionFeedback; }
        public void setRevisionFeedback(String revisionFeedback) { this.revisionFeedback = revisionFeedback; }
    }

    public static class UpdateProgressRequest {
        private Integer progressPercent;

        public Integer getProgressPercent() { return progressPercent; }
        public void setProgressPercent(Integer progressPercent) { this.progressPercent = progressPercent; }
    }
}
