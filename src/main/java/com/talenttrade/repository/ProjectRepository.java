package com.talenttrade.repository;

import com.talenttrade.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByStatus(Project.Status status);

    List<Project> findByClientId(Long clientId);

    List<Project> findByHiredFreelancerId(Long freelancerId);

    @Query("SELECT p FROM Project p WHERE " +
           "(:category IS NULL OR :category = '' OR LOWER(p.category) = LOWER(:category)) " +
           "AND (:budgetType IS NULL OR p.budgetType = :budgetType) " +
           "AND (:status IS NULL OR p.status = :status) " +
           "AND (:search IS NULL OR :search = '' OR " +
           "     LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "     LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "     LOWER(p.requiredSkills) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Project> filterProjects(
            @Param("category") String category,
            @Param("budgetType") Project.BudgetType budgetType,
            @Param("status") Project.Status status,
            @Param("search") String search
    );

    @Query("SELECT DISTINCT p.category FROM Project p")
    List<String> findDistinctCategories();
}
