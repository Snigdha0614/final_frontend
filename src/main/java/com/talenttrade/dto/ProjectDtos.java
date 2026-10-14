package com.talenttrade.dto;

import com.talenttrade.entity.Project;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class ProjectDtos {

    public static class CreateProjectRequest {
        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Description is required")
        private String description;

        @NotBlank(message = "Category is required")
        private String category;

        @NotNull(message = "Budget type is required")
        private Project.BudgetType budgetType;

        private BigDecimal fixedBudget;
        private BigDecimal budgetMin;
        private BigDecimal budgetMax;
        private LocalDate deadline;
        private String requiredSkills;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public Project.BudgetType getBudgetType() { return budgetType; }
        public void setBudgetType(Project.BudgetType budgetType) { this.budgetType = budgetType; }
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
    }

    public static class SubmitProposalRequest {
        @NotBlank(message = "Cover letter is required")
        private String coverLetter;

        private BigDecimal bidAmount;
        private Integer deliveryDays;
        private String offeredSkill;

        public String getCoverLetter() { return coverLetter; }
        public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }
        public BigDecimal getBidAmount() { return bidAmount; }
        public void setBidAmount(BigDecimal bidAmount) { this.bidAmount = bidAmount; }
        public Integer getDeliveryDays() { return deliveryDays; }
        public void setDeliveryDays(Integer deliveryDays) { this.deliveryDays = deliveryDays; }
        public String getOfferedSkill() { return offeredSkill; }
        public void setOfferedSkill(String offeredSkill) { this.offeredSkill = offeredSkill; }
    }
}
