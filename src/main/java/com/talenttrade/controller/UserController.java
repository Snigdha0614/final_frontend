package com.talenttrade.controller;

import com.talenttrade.dto.UserDtos;
import com.talenttrade.entity.*;
import com.talenttrade.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/freelancers")
    public ResponseEntity<List<User>> getFreelancers(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(userService.getFreelancers(search));
    }

    @GetMapping("/freelancers/{id}")
    public ResponseEntity<User> getFreelancerById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@AuthenticationPrincipal User principal,
                                              @RequestBody UserDtos.UpdateProfileRequest req) {
        return ResponseEntity.ok(userService.updateProfile(principal.getId(), req));
    }

    @PostMapping("/profile/skills")
    public ResponseEntity<Skill> addSkill(@AuthenticationPrincipal User principal,
                                          @RequestBody UserDtos.SkillRequest req) {
        return ResponseEntity.ok(userService.addSkill(principal.getId(), req));
    }

    @DeleteMapping("/profile/skills/{id}")
    public ResponseEntity<Void> deleteSkill(@AuthenticationPrincipal User principal,
                                            @PathVariable Long id) {
        userService.deleteSkill(principal.getId(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/profile/certifications")
    public ResponseEntity<Certification> addCertification(@AuthenticationPrincipal User principal,
                                                          @RequestBody UserDtos.CertificationRequest req) {
        return ResponseEntity.ok(userService.addCertification(principal.getId(), req));
    }

    @DeleteMapping("/profile/certifications/{id}")
    public ResponseEntity<Void> deleteCertification(@AuthenticationPrincipal User principal,
                                                    @PathVariable Long id) {
        userService.deleteCertification(principal.getId(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/profile/portfolio")
    public ResponseEntity<PortfolioItem> addPortfolioItem(@AuthenticationPrincipal User principal,
                                                          @RequestBody UserDtos.PortfolioRequest req) {
        return ResponseEntity.ok(userService.addPortfolioItem(principal.getId(), req));
    }

    @DeleteMapping("/profile/portfolio/{id}")
    public ResponseEntity<Void> deletePortfolioItem(@AuthenticationPrincipal User principal,
                                                    @PathVariable Long id) {
        userService.deletePortfolioItem(principal.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
