package com.talenttrade.repository;

import com.talenttrade.entity.SkillExchange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillExchangeRepository extends JpaRepository<SkillExchange, Long> {

    @Query("SELECT e FROM SkillExchange e WHERE e.initiator.id = :userId OR e.receiver.id = :userId ORDER BY e.updatedAt DESC")
    List<SkillExchange> findByUserInvolved(@Param("userId") Long userId);

    List<SkillExchange> findByStatus(SkillExchange.Status status);

    @Query("SELECT e FROM SkillExchange e WHERE " +
           "(:status IS NULL OR e.status = :status) AND " +
           "(:type IS NULL OR e.exchangeType = :type) AND " +
           "(:search IS NULL OR :search = '' OR " +
           " LOWER(e.offeredSkillTitle) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(e.requestedSkillTitle) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(e.termsNote) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<SkillExchange> filterExchanges(
            @Param("status") SkillExchange.Status status,
            @Param("type") SkillExchange.ExchangeType type,
            @Param("search") String search
    );
}
