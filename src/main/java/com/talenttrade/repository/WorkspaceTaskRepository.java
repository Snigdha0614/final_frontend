package com.talenttrade.repository;

import com.talenttrade.entity.WorkspaceTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkspaceTaskRepository extends JpaRepository<WorkspaceTask, Long> {
    List<WorkspaceTask> findByWorkspaceIdOrderByCreatedAtAsc(Long workspaceId);
}
