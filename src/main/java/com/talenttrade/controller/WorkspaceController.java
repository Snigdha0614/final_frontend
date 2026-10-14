package com.talenttrade.controller;

import com.talenttrade.dto.WorkspaceDtos;
import com.talenttrade.entity.*;
import com.talenttrade.service.WorkspaceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectWorkspace>> getUserWorkspaces(@AuthenticationPrincipal User principal) {
        return ResponseEntity.ok(workspaceService.getUserWorkspaces(principal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectWorkspace> getWorkspaceById(
            @PathVariable Long id,
            @AuthenticationPrincipal User principal) {
        return ResponseEntity.ok(workspaceService.getWorkspaceById(id, principal.getId()));
    }

    @PostMapping("/order-service/{serviceId}")
    public ResponseEntity<ProjectWorkspace> orderServiceDirect(
            @PathVariable Long serviceId,
            @AuthenticationPrincipal User principal) {
        return ResponseEntity.ok(workspaceService.orderServiceDirect(serviceId, principal.getId()));
    }

    @GetMapping("/{id}/tasks")
    public ResponseEntity<List<WorkspaceTask>> getTasks(
            @PathVariable Long id,
            @AuthenticationPrincipal User principal) {
        return ResponseEntity.ok(workspaceService.getTasks(id, principal.getId()));
    }

    @PostMapping("/{id}/tasks")
    public ResponseEntity<WorkspaceTask> createTask(
            @PathVariable Long id,
            @AuthenticationPrincipal User principal,
            @Valid @RequestBody WorkspaceDtos.CreateTaskRequest req) {
        return ResponseEntity.ok(workspaceService.createTask(id, req, principal.getId()));
    }

    @PutMapping("/tasks/{taskId}/status")
    public ResponseEntity<WorkspaceTask> updateTaskStatus(
            @PathVariable Long taskId,
            @AuthenticationPrincipal User principal,
            @RequestBody WorkspaceDtos.UpdateTaskStatusRequest req) {
        return ResponseEntity.ok(workspaceService.updateTaskStatus(taskId, req.getStatus(), principal.getId()));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<WorkspaceMessage>> getMessages(
            @PathVariable Long id,
            @AuthenticationPrincipal User principal) {
        return ResponseEntity.ok(workspaceService.getMessages(id, principal.getId()));
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<WorkspaceMessage> sendMessage(
            @PathVariable Long id,
            @AuthenticationPrincipal User principal,
            @Valid @RequestBody WorkspaceDtos.SendMessageRequest req) {
        return ResponseEntity.ok(workspaceService.sendMessage(id, req, principal.getId()));
    }

    @GetMapping("/{id}/submissions")
    public ResponseEntity<List<WorkspaceSubmission>> getSubmissions(
            @PathVariable Long id,
            @AuthenticationPrincipal User principal) {
        return ResponseEntity.ok(workspaceService.getSubmissions(id, principal.getId()));
    }

    @PostMapping("/{id}/submissions")
    public ResponseEntity<WorkspaceSubmission> submitWork(
            @PathVariable Long id,
            @AuthenticationPrincipal User principal,
            @Valid @RequestBody WorkspaceDtos.SubmitWorkRequest req) {
        return ResponseEntity.ok(workspaceService.submitWork(id, req, principal.getId()));
    }

    @PostMapping("/{id}/submissions/{subId}/review")
    public ResponseEntity<WorkspaceSubmission> reviewWork(
            @PathVariable Long id,
            @PathVariable Long subId,
            @AuthenticationPrincipal User principal,
            @RequestBody WorkspaceDtos.ReviewWorkRequest req) {
        return ResponseEntity.ok(workspaceService.reviewSubmission(id, subId, req, principal.getId()));
    }

    @PutMapping("/{id}/progress")
    public ResponseEntity<ProjectWorkspace> updateProgress(
            @PathVariable Long id,
            @AuthenticationPrincipal User principal,
            @RequestBody WorkspaceDtos.UpdateProgressRequest req) {
        return ResponseEntity.ok(workspaceService.updateProgress(id, req.getProgressPercent(), principal.getId()));
    }
}
