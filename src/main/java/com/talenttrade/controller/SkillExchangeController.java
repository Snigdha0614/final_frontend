package com.talenttrade.controller;

import com.talenttrade.dto.ExchangeDtos;
import com.talenttrade.entity.ExchangeCounterOffer;
import com.talenttrade.entity.ProjectWorkspace;
import com.talenttrade.entity.SkillExchange;
import com.talenttrade.entity.User;
import com.talenttrade.service.SkillExchangeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exchanges")
public class SkillExchangeController {

    private final SkillExchangeService exchangeService;

    public SkillExchangeController(SkillExchangeService exchangeService) {
        this.exchangeService = exchangeService;
    }

    @GetMapping
    public ResponseEntity<List<SkillExchange>> getExchanges(
            @RequestParam(required = false) SkillExchange.Status status,
            @RequestParam(required = false) SkillExchange.ExchangeType type,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(exchangeService.filterExchanges(status, type, search));
    }

    @GetMapping("/my")
    public ResponseEntity<List<SkillExchange>> getMyExchanges(@AuthenticationPrincipal User principal) {
        return ResponseEntity.ok(exchangeService.getUserExchanges(principal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SkillExchange> getExchangeById(@PathVariable Long id) {
        return ResponseEntity.ok(exchangeService.getExchangeById(id));
    }

    @PostMapping
    public ResponseEntity<SkillExchange> createExchange(
            @AuthenticationPrincipal User principal,
            @Valid @RequestBody ExchangeDtos.CreateExchangeRequest req) {
        return ResponseEntity.ok(exchangeService.createExchange(principal.getId(), req));
    }

    @PostMapping("/{id}/counter")
    public ResponseEntity<ExchangeCounterOffer> submitCounterOffer(
            @PathVariable Long id,
            @AuthenticationPrincipal User principal,
            @Valid @RequestBody ExchangeDtos.CounterOfferRequest req) {
        return ResponseEntity.ok(exchangeService.submitCounterOffer(id, principal.getId(), req));
    }

    @GetMapping("/{id}/counters")
    public ResponseEntity<List<ExchangeCounterOffer>> getCounterOffers(@PathVariable Long id) {
        return ResponseEntity.ok(exchangeService.getCounterOffers(id));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<ProjectWorkspace> acceptExchange(
            @PathVariable Long id,
            @AuthenticationPrincipal User principal) {
        return ResponseEntity.ok(exchangeService.acceptExchange(id, principal.getId()));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Void> rejectExchange(
            @PathVariable Long id,
            @AuthenticationPrincipal User principal) {
        exchangeService.rejectExchange(id, principal.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Void> completeExchange(
            @PathVariable Long id,
            @AuthenticationPrincipal User principal) {
        exchangeService.completeExchange(id, principal.getId());
        return ResponseEntity.ok().build();
    }
}
