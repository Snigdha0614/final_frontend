package com.talenttrade.repository;

import com.talenttrade.entity.ServiceListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ServiceListingRepository extends JpaRepository<ServiceListing, Long> {

    List<ServiceListing> findByActiveTrue();

    List<ServiceListing> findBySellerId(Long sellerId);

    @Query("SELECT s FROM ServiceListing s WHERE s.active = true " +
           "AND (:category IS NULL OR :category = '' OR LOWER(s.category) = LOWER(:category)) " +
           "AND (:minPrice IS NULL OR s.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR s.price <= :maxPrice) " +
           "AND (:search IS NULL OR :search = '' OR " +
           "     LOWER(s.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "     LOWER(s.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "     LOWER(s.tags) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<ServiceListing> filterServices(
            @Param("category") String category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("search") String search
    );

    @Query("SELECT DISTINCT s.category FROM ServiceListing s WHERE s.active = true")
    List<String> findDistinctCategories();
}
