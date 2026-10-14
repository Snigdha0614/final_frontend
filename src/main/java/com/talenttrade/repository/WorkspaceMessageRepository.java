package com.talenttrade.repository;

import com.talenttrade.entity.WorkspaceMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkspaceMessageRepository extends JpaRepository<WorkspaceMessage, Long> {
    List<WorkspaceMessage> findByWorkspaceIdOrderByCreatedAtAsc(Long workspaceId);
}
