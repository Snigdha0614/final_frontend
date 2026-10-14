package com.talenttrade.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewee_id", nullable = false)
    private User reviewee;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_id")
    private ServiceListing serviceListing;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "workspace_id")
    private ProjectWorkspace workspace;

    @Column(nullable = false)
    private Integer rating; // 1 to 5

    @Column(columnDefinition = "TEXT", nullable = false)
    private String comment;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Review() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getReviewer() { return reviewer; }
    public void setReviewer(User reviewer) { this.reviewer = reviewer; }

    public User getReviewee() { return reviewee; }
    public void setReviewee(User reviewee) { this.reviewee = reviewee; }

    public ServiceListing getServiceListing() { return serviceListing; }
    public void setServiceListing(ServiceListing serviceListing) { this.serviceListing = serviceListing; }

    public ProjectWorkspace getWorkspace() { return workspace; }
    public void setWorkspace(ProjectWorkspace workspace) { this.workspace = workspace; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
