package com.talenttrade.controller;

import com.talenttrade.dto.ProjectDtos;
import com.talenttrade.entity.Project;
import com.talenttrade.entity.ProjectProposal;
import com.talenttrade.entity.ProjectWorkspace;
import com.talenttrade.entity.User;
import com.talenttrade.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<Project>> getProjects(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Project.BudgetType budgetType,
            @RequestParam(required = false) Project.Status status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(projectService.filterProjects(category, budgetType, status, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(projectService.getCategories());
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Project>> getClientProjects(@PathVariable Long clientId) {
        return ResponseEntity.ok(projectService.getClientProjects(clientId));
    }

    @PostMapping
    public ResponseEntity<Project> createProject(
            @AuthenticationPrincipal User principal,
            @Valid @RequestBody ProjectDtos.CreateProjectRequest req) {
        return ResponseEntity.ok(projectService.createProject(principal.getId(), req));
    }

    @PostMapping("/{id}/proposals")
    public ResponseEntity<ProjectProposal> submitProposal(
            @PathVariable Long id,
            @AuthenticationPrincipal User principal,
            @Valid @RequestBody ProjectDtos.SubmitProposalRequest req) {
        return ResponseEntity.ok(projectService.submitProposal(id, principal.getId(), req));
    }

    @GetMapping("/{id}/proposals")
    public ResponseEntity<List<ProjectProposal>> getProposals(
            @PathVariable Long id,
            @AuthenticationPrincipal User principal) {
        return ResponseEntity.ok(projectService.getProjectProposals(id, principal.getId()));
    }

    @PostMapping("/{id}/proposals/{proposalId}/accept")
    public ResponseEntity<ProjectWorkspace> acceptProposal(
            @PathVariable Long id,
            @PathVariable Long proposalId,
            @AuthenticationPrincipal User principal) {
        return ResponseEntity.ok(projectService.acceptProposal(id, proposalId, principal.getId()));
    }

    @PostMapping("/{id}/proposals/{proposalId}/reject")
    public ResponseEntity<Void> rejectProposal(
            @PathVariable Long id,
            @PathVariable Long proposalId,
            @AuthenticationPrincipal User principal) {
        projectService.rejectProposal(id, proposalId, principal.getId());
        return ResponseEntity.noContent().build();
    }
}
