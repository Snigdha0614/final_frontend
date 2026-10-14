package com.talenttrade.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "services")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ServiceListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false, length = 100)
    private String category; // Web Development, UI/UX Design, Mobile Apps, AI & Machine Learning, Content & Copywriting, Video & Animation, etc.

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer deliveryDays;

    private Integer revisionsAllowed = 3;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    private Double ratingAvg = 5.0;

    private Integer reviewCount = 0;

    @Column(length = 255)
    private String tags;

    @Column(length = 500)
    private String imageUrl;

    private boolean featured = false;

    private boolean active = true;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public ServiceListing() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public User getSeller() { return seller; }
    public void setSeller(User seller) { this.seller = seller; }

    public Double getRatingAvg() { return ratingAvg; }
    public void setRatingAvg(Double ratingAvg) { this.ratingAvg = ratingAvg; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
