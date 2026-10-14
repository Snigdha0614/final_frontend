package com.talenttrade.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ServiceDtos {

    public static class CreateServiceRequest {
        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Description is required")
        private String description;

        @NotBlank(message = "Category is required")
        private String category;

        @NotNull(message = "Price is required")
        @DecimalMin(value = "5.0", message = "Minimum price is $5.00")
        private BigDecimal price;

        @NotNull(message = "Delivery days is required")
        @Min(value = 1, message = "Delivery must be at least 1 day")
        private Integer deliveryDays;

        private Integer revisionsAllowed = 3;
        private String tags;
        private String imageUrl;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        public Integer getDeliveryDays() { return deliveryDays; }
        public void setDeliveryDays(Integer deliveryDays) { this.deliveryDays = deliveryDays; }
        public Integer getRevisionsAllowed() { return revisionsAllowed; }
        public void setRevisionsAllowed(Integer revisionsAllowed) { this.revisionsAllowed = revisionsAllowed; }
        public String getTags() { return tags; }
        public void setTags(String tags) { this.tags = tags; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    }
}
