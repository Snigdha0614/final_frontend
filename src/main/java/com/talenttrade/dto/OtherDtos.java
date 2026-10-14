package com.talenttrade.dto;

import com.talenttrade.entity.Dispute;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class OtherDtos {

    public static class WalletDepositRequest {
        @NotNull(message = "Amount is required")
        @DecimalMin(value = "1.00", message = "Minimum deposit is $1.00")
        private BigDecimal amount;

        private String paymentMethod; // MOCK_CREDIT_CARD, MOCK_PAYPAL, MOCK_BANK

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    }

    public static class WalletWithdrawRequest {
        @NotNull(message = "Amount is required")
        @DecimalMin(value = "1.00", message = "Minimum withdrawal is $1.00")
        private BigDecimal amount;

        private String bankAccount;

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public String getBankAccount() { return bankAccount; }
        public void setBankAccount(String bankAccount) { this.bankAccount = bankAccount; }
    }

    public static class CreateReviewRequest {
        @NotNull(message = "Reviewee ID is required")
        private Long revieweeId;

        private Long serviceId;
        private Long workspaceId;

        @NotNull(message = "Rating is required")
        @Min(value = 1, message = "Minimum rating is 1")
        @Max(value = 5, message = "Maximum rating is 5")
        private Integer rating;

        @NotBlank(message = "Comment is required")
        private String comment;

        public Long getRevieweeId() { return revieweeId; }
        public void setRevieweeId(Long revieweeId) { this.revieweeId = revieweeId; }
        public Long getServiceId() { return serviceId; }
        public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
        public Long getWorkspaceId() { return workspaceId; }
        public void setWorkspaceId(Long workspaceId) { this.workspaceId = workspaceId; }
        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }

    public static class CreateDisputeRequest {
        @NotNull(message = "Workspace ID is required")
        private Long workspaceId;

        @NotBlank(message = "Reason is required")
        private String reason;

        @NotBlank(message = "Description is required")
        private String description;

        public Long getWorkspaceId() { return workspaceId; }
        public void setWorkspaceId(Long workspaceId) { this.workspaceId = workspaceId; }
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class ResolveDisputeRequest {
        @NotNull(message = "Status resolution is required")
        private Dispute.Status status;

        private String adminNotes;

        public Dispute.Status getStatus() { return status; }
        public void setStatus(Dispute.Status status) { this.status = status; }
        public String getAdminNotes() { return adminNotes; }
        public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
    }
}
