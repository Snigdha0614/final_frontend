package com.talenttrade.controller;

import com.talenttrade.entity.*;
import com.talenttrade.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getSystemStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<User> toggleUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleUserStatus(id));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestParam Role role) {
        return ResponseEntity.ok(adminService.updateUserRole(id, role));
    }

    @GetMapping("/services")
    public ResponseEntity<List<ServiceListing>> getAllServices() {
        return ResponseEntity.ok(adminService.getAllServices());
    }

    @PutMapping("/services/{id}/toggle-status")
    public ResponseEntity<ServiceListing> toggleServiceStatus(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleServiceStatus(id));
    }

    @GetMapping("/projects")
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(adminService.getAllProjects());
    }

    @GetMapping("/exchanges")
    public ResponseEntity<List<SkillExchange>> getAllExchanges() {
        return ResponseEntity.ok(adminService.getAllExchanges());
    }
}
