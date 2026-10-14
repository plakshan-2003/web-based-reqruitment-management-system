package com.careerlink.backend.controller;

import com.careerlink.backend.entity.Notification;
import com.careerlink.backend.entity.User;
import com.careerlink.backend.entity.enums.NotificationType;
import com.careerlink.backend.repository.UserRepository;
import com.careerlink.backend.service.NotificationService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(NotificationService notificationService, UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    // manual / admin-sent notification. body: userId, message, type (optional, default GENERAL)
    @PostMapping
    public Notification send(@RequestBody Map<String, String> body) {
        if (body.get("userId") == null || body.get("message") == null || body.get("message").isBlank()) {
            throw new IllegalArgumentException("userId and message are required.");
        }
        Long userId = Long.valueOf(body.get("userId"));
        User recipient = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        NotificationType type = body.get("type") != null
                ? NotificationType.valueOf(body.get("type").toUpperCase())
                : NotificationType.GENERAL;
        return notificationService.send(recipient, body.get("message"), type);
    }

    // FR-23
    @GetMapping("/user/{userId}")
    public List<Notification> byUser(@PathVariable Long userId) {
        return notificationService.getForUser(userId);
    }

    @GetMapping("/user/{userId}/unread")
    public List<Notification> unreadByUser(@PathVariable Long userId) {
        return notificationService.getUnreadForUser(userId);
    }

    @GetMapping("/{notificationId}")
    public Notification get(@PathVariable Long notificationId) {
        return notificationService.getById(notificationId);
    }

    @PutMapping("/{notificationId}/read")
    public void markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
    }

    @PutMapping("/user/{userId}/read-all")
    public Map<String, String> markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return Map.of("message", "All notifications marked as read for user " + userId + ".");
    }

    @DeleteMapping("/{notificationId}")
    public Map<String, String> delete(@PathVariable Long notificationId) {
        notificationService.delete(notificationId);
        return Map.of("message", "Notification " + notificationId + " deleted.");
    }
}
