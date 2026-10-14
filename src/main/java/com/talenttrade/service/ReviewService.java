package com.talenttrade.service;

import com.talenttrade.dto.OtherDtos;
import com.talenttrade.entity.*;
import com.talenttrade.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ServiceListingRepository serviceRepository;
    private final ProjectWorkspaceRepository workspaceRepository;
    private final NotificationService notificationService;

    public ReviewService(ReviewRepository reviewRepository,
                         UserRepository userRepository,
                         ServiceListingRepository serviceRepository,
                         ProjectWorkspaceRepository workspaceRepository,
                         NotificationService notificationService) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.workspaceRepository = workspaceRepository;
        this.notificationService = notificationService;
    }

    public List<Review> getReviewsForUser(Long userId) {
        return reviewRepository.findByRevieweeIdOrderByCreatedAtDesc(userId);
    }

    public List<Review> getReviewsForService(Long serviceId) {
        return reviewRepository.findByServiceListingIdOrderByCreatedAtDesc(serviceId);
    }

    @Transactional
    public Review createReview(Long reviewerId, OtherDtos.CreateReviewRequest req) {
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new IllegalArgumentException("Reviewer not found"));
        User reviewee = userRepository.findById(req.getRevieweeId())
                .orElseThrow(() -> new IllegalArgumentException("Reviewee not found"));

        if (reviewerId.equals(req.getRevieweeId())) {
            throw new IllegalArgumentException("Cannot review yourself");
        }

        Review review = new Review();
        review.setReviewer(reviewer);
        review.setReviewee(reviewee);
        review.setRating(req.getRating());
        review.setComment(req.getComment().trim());

        if (req.getWorkspaceId() != null) {
            workspaceRepository.findById(req.getWorkspaceId()).ifPresent(review::setWorkspace);
        }

        if (req.getServiceId() != null) {
            ServiceListing srv = serviceRepository.findById(req.getServiceId()).orElse(null);
            if (srv != null) {
                review.setServiceListing(srv);

                // Recalculate service rating
                List<Review> srvReviews = reviewRepository.findByServiceListingIdOrderByCreatedAtDesc(srv.getId());
                double sum = req.getRating();
                for (Review r : srvReviews) {
                    sum += r.getRating();
                }
                int count = srvReviews.size() + 1;
                srv.setRatingAvg(Math.round((sum / count) * 10.0) / 10.0);
                srv.setReviewCount(count);
                serviceRepository.save(srv);
            }
        }

        review = reviewRepository.save(review);

        // Recalculate user rating
        List<Review> userReviews = reviewRepository.findByRevieweeIdOrderByCreatedAtDesc(reviewee.getId());
        double userSum = 0;
        for (Review r : userReviews) {
            userSum += r.getRating();
        }
        int userCount = userReviews.size();
        if (userCount > 0) {
            reviewee.setRatingAvg(Math.round((userSum / userCount) * 10.0) / 10.0);
            reviewee.setReviewCount(userCount);
            userRepository.save(reviewee);
        }

        notificationService.sendNotification(
                reviewee,
                "New Review Received ★ " + req.getRating(),
                reviewer.getFullName() + " left you a review: \"" + (req.getComment().length() > 50 ? req.getComment().substring(0, 47) + "..." : req.getComment()) + "\"",
                "/profile",
                "REVIEW"
        );

        return review;
    }
}
