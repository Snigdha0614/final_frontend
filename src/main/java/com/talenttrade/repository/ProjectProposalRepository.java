package com.talenttrade.repository;

import com.talenttrade.entity.ProjectProposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectProposalRepository extends JpaRepository<ProjectProposal, Long> {
    List<ProjectProposal> findByProjectId(Long projectId);
    List<ProjectProposal> findByFreelancerId(Long freelancerId);
    Optional<ProjectProposal> findByProjectIdAndFreelancerId(Long projectId, Long freelancerId);
    boolean existsByProjectIdAndFreelancerId(Long projectId, Long freelancerId);
}
