package com.talenttrade.controller;

import com.talenttrade.entity.User;
import com.talenttrade.entity.Wishlist;
import com.talenttrade.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public ResponseEntity<List<Wishlist>> getUserWishlist(@AuthenticationPrincipal User principal) {
        return ResponseEntity.ok(wishlistService.getUserWishlist(principal.getId()));
    }

    @PostMapping("/service/{serviceId}")
    public ResponseEntity<Map<String, Boolean>> toggleServiceWishlist(
            @PathVariable Long serviceId,
            @AuthenticationPrincipal User principal) {
        boolean saved = wishlistService.toggleServiceWishlist(principal.getId(), serviceId);
        return ResponseEntity.ok(Map.of("saved", saved));
    }

    @PostMapping("/project/{projectId}")
    public ResponseEntity<Map<String, Boolean>> toggleProjectWishlist(
            @PathVariable Long projectId,
            @AuthenticationPrincipal User principal) {
        boolean saved = wishlistService.toggleProjectWishlist(principal.getId(), projectId);
        return ResponseEntity.ok(Map.of("saved", saved));
    }
}
