package com.talenttrade.repository;

import com.talenttrade.entity.Dispute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisputeRepository extends JpaRepository<Dispute, Long> {
    List<Dispute> findByWorkspaceId(Long workspaceId);
    List<Dispute> findByStatus(Dispute.Status status);
    List<Dispute> findByInitiatorIdOrRespondentId(Long initiatorId, Long respondentId);
}
