package com.talenttrade.controller;

import com.talenttrade.dto.OtherDtos;
import com.talenttrade.entity.Dispute;
import com.talenttrade.entity.User;
import com.talenttrade.service.DisputeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disputes")
public class DisputeController {

    private final DisputeService disputeService;

    public DisputeController(DisputeService disputeService) {
        this.disputeService = disputeService;
    }

    @GetMapping("/my")
    public ResponseEntity<List<Dispute>> getMyDisputes(@AuthenticationPrincipal User principal) {
        return ResponseEntity.ok(disputeService.getDisputesForUser(principal.getId()));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Dispute>> getAllDisputes() {
        return ResponseEntity.ok(disputeService.getAllDisputes());
    }

    @PostMapping
    public ResponseEntity<Dispute> createDispute(
            @AuthenticationPrincipal User principal,
            @Valid @RequestBody OtherDtos.CreateDisputeRequest req) {
        return ResponseEntity.ok(disputeService.createDispute(principal.getId(), req));
    }

    @PostMapping("/{id}/resolve")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Dispute> resolveDispute(
            @PathVariable Long id,
            @Valid @RequestBody OtherDtos.ResolveDisputeRequest req) {
        return ResponseEntity.ok(disputeService.resolveDispute(id, req));
    }
}
