package com.talenttrade.dto;

import com.talenttrade.entity.SkillExchange;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class ExchangeDtos {

    public static class CreateExchangeRequest {
        @NotNull(message = "Receiver ID is required")
        private Long receiverId;

        @NotNull(message = "Exchange type is required")
        private SkillExchange.ExchangeType exchangeType;

        @NotBlank(message = "Offered skill title is required")
        private String offeredSkillTitle;

        private String offeredSkillDescription;

        @NotBlank(message = "Requested skill title is required")
        private String requestedSkillTitle;

        private String requestedSkillDescription;

        private BigDecimal cashCompensation = BigDecimal.ZERO;

        private SkillExchange.CompensationPayer compensationPayer = SkillExchange.CompensationPayer.NONE;

        private String termsNote;

        private LocalDate deadline;

        public Long getReceiverId() { return receiverId; }
        public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }
        public SkillExchange.ExchangeType getExchangeType() { return exchangeType; }
        public void setExchangeType(SkillExchange.ExchangeType exchangeType) { this.exchangeType = exchangeType; }
        public String getOfferedSkillTitle() { return offeredSkillTitle; }
        public void setOfferedSkillTitle(String offeredSkillTitle) { this.offeredSkillTitle = offeredSkillTitle; }
        public String getOfferedSkillDescription() { return offeredSkillDescription; }
        public void setOfferedSkillDescription(String offeredSkillDescription) { this.offeredSkillDescription = offeredSkillDescription; }
        public String getRequestedSkillTitle() { return requestedSkillTitle; }
        public void setRequestedSkillTitle(String requestedSkillTitle) { this.requestedSkillTitle = requestedSkillTitle; }
        public String getRequestedSkillDescription() { return requestedSkillDescription; }
        public void setRequestedSkillDescription(String requestedSkillDescription) { this.requestedSkillDescription = requestedSkillDescription; }
        public BigDecimal getCashCompensation() { return cashCompensation; }
        public void setCashCompensation(BigDecimal cashCompensation) { this.cashCompensation = cashCompensation; }
        public SkillExchange.CompensationPayer getCompensationPayer() { return compensationPayer; }
        public void setCompensationPayer(SkillExchange.CompensationPayer compensationPayer) { this.compensationPayer = compensationPayer; }
        public String getTermsNote() { return termsNote; }
        public void setTermsNote(String termsNote) { this.termsNote = termsNote; }
        public LocalDate getDeadline() { return deadline; }
        public void setDeadline(LocalDate deadline) { this.deadline = deadline; }
    }

    public static class CounterOfferRequest {
        @NotBlank(message = "Counter offered skill is required")
        private String counterOfferedSkill;

        @NotBlank(message = "Counter requested skill is required")
        private String counterRequestedSkill;

        private BigDecimal counterCashCompensation = BigDecimal.ZERO;

        private SkillExchange.CompensationPayer counterCompensationPayer = SkillExchange.CompensationPayer.NONE;

        private String note;

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
    }
}
