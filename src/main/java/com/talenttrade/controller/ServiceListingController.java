package com.talenttrade.controller;

import com.talenttrade.dto.ServiceDtos;
import com.talenttrade.entity.ServiceListing;
import com.talenttrade.entity.User;
import com.talenttrade.service.ServiceListingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceListingController {

    private final ServiceListingService serviceListingService;

    public ServiceListingController(ServiceListingService serviceListingService) {
        this.serviceListingService = serviceListingService;
    }

    @GetMapping
    public ResponseEntity<List<ServiceListing>> getServices(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(serviceListingService.filterServices(category, minPrice, maxPrice, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceListing> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceListingService.getServiceById(id));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(serviceListingService.getCategories());
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<ServiceListing>> getServicesBySeller(@PathVariable Long sellerId) {
        return ResponseEntity.ok(serviceListingService.getServicesBySeller(sellerId));
    }

    @PostMapping
    public ResponseEntity<ServiceListing> createService(
            @AuthenticationPrincipal User principal,
            @Valid @RequestBody ServiceDtos.CreateServiceRequest req) {
        return ResponseEntity.ok(serviceListingService.createService(principal.getId(), req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceListing> updateService(
            @PathVariable Long id,
            @AuthenticationPrincipal User principal,
            @Valid @RequestBody ServiceDtos.CreateServiceRequest req) {
        return ResponseEntity.ok(serviceListingService.updateService(id, principal.getId(), req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(
            @PathVariable Long id,
            @AuthenticationPrincipal User principal) {
        serviceListingService.deleteService(id, principal.getId());
        return ResponseEntity.noContent().build();
    }
}
