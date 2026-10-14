package com.talenttrade.repository;

import com.talenttrade.entity.ProjectWorkspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectWorkspaceRepository extends JpaRepository<ProjectWorkspace, Long> {

    @Query("SELECT w FROM ProjectWorkspace w WHERE w.client.id = :userId OR w.freelancer.id = :userId ORDER BY w.updatedAt DESC")
    List<ProjectWorkspace> findByUserInvolved(@Param("userId") Long userId);

    List<ProjectWorkspace> findByStatus(ProjectWorkspace.Status status);
}
