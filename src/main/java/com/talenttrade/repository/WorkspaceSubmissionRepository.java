package com.talenttrade.repository;

import com.talenttrade.entity.WorkspaceSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkspaceSubmissionRepository extends JpaRepository<WorkspaceSubmission, Long> {
    List<WorkspaceSubmission> findByWorkspaceIdOrderByCreatedAtDesc(Long workspaceId);
}
