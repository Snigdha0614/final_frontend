package com.talenttrade.controller;

import com.talenttrade.entity.Notification;
import com.talenttrade.entity.User;
import com.talenttrade.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(@AuthenticationPrincipal User principal) {
        return ResponseEntity.ok(notificationService.getUserNotifications(principal.getId()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal User principal) {
        return ResponseEntity.ok(Map.of("unreadCount", notificationService.getUnreadCount(principal.getId())));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal User principal) {
        notificationService.markAsRead(id, principal.getId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal User principal) {
        notificationService.markAllAsRead(principal.getId());
        return ResponseEntity.ok().build();
    }
}
