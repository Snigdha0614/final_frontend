package com.talenttrade.controller;

import com.talenttrade.dto.OtherDtos;
import com.talenttrade.entity.Review;
import com.talenttrade.entity.User;
import com.talenttrade.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsForUser(userId));
    }

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<Review>> getReviewsForService(@PathVariable Long serviceId) {
        return ResponseEntity.ok(reviewService.getReviewsForService(serviceId));
    }

    @PostMapping
    public ResponseEntity<Review> createReview(
            @AuthenticationPrincipal User principal,
            @Valid @RequestBody OtherDtos.CreateReviewRequest req) {
        return ResponseEntity.ok(reviewService.createReview(principal.getId(), req));
    }
}
