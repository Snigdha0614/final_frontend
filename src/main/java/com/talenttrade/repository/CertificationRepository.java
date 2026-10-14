package com.talenttrade.repository;

import com.talenttrade.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {
    List<Certification> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
