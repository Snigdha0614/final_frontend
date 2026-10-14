package com.talenttrade.repository;

import com.talenttrade.entity.ExchangeCounterOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExchangeCounterOfferRepository extends JpaRepository<ExchangeCounterOffer, Long> {
    List<ExchangeCounterOffer> findBySkillExchangeIdOrderByCreatedAtDesc(Long skillExchangeId);
}
