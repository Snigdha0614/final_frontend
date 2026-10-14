package com.talenttrade.repository;

import com.talenttrade.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserId(Long userId);
    Optional<Wishlist> findByUserIdAndServiceListingId(Long userId, Long serviceId);
    Optional<Wishlist> findByUserIdAndProjectId(Long userId, Long projectId);
    void deleteByUserIdAndServiceListingId(Long userId, Long serviceId);
    void deleteByUserIdAndProjectId(Long userId, Long projectId);
}
