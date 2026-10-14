package com.talenttrade.repository;

import com.talenttrade.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRevieweeIdOrderByCreatedAtDesc(Long revieweeId);
    List<Review> findByServiceListingIdOrderByCreatedAtDesc(Long serviceId);
    boolean existsByWorkspaceIdAndReviewerId(Long workspaceId, Long reviewerId);
}
