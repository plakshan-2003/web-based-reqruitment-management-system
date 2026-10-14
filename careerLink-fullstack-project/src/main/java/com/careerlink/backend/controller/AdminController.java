package com.careerlink.backend.controller;

import com.careerlink.backend.entity.Admin;
import com.careerlink.backend.entity.Notification;
import com.careerlink.backend.entity.Staff;
import com.careerlink.backend.entity.User;
import com.careerlink.backend.repository.AdminRepository;
import com.careerlink.backend.repository.StaffRepository;
import com.careerlink.backend.service.NotificationService;
import com.careerlink.backend.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
public class AdminController {

    private final UserService userService;
    private final NotificationService notificationService;
    private final AdminRepository adminRepository;
    private final StaffRepository staffRepository;

    public AdminController(UserService userService, NotificationService notificationService,
                           AdminRepository adminRepository, StaffRepository staffRepository) {
        this.userService = userService;
        this.notificationService = notificationService;
        this.adminRepository = adminRepository;
        this.staffRepository = staffRepository;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{userId}")
    public User getUser(@PathVariable Long userId) {
        return userService.getUserById(userId);
    }

    // FR-22
    @PutMapping("/{userId}/ban")
    public User ban(@PathVariable Long userId) {
        return userService.banUser(userId);
    }

    @PutMapping("/{userId}/unban")
    public User unban(@PathVariable Long userId) {
        return userService.unbanUser(userId);
    }

    @DeleteMapping("/{userId}")
    public Map<String, String> delete(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return Map.of("message", "User " + userId + " deleted.");
    }

    // Admin asks staff to create a job posting.
    // body: jobTitle, salaryMin, salaryMax, deadline (yyyy-MM-dd), notes (optional),
    //       staffId (optional - leave it out to notify every staff member)
    @PostMapping("/job-requests")
    public List<Notification> requestJobPosting(@RequestParam Long adminId, @RequestBody Map<String, Object> body) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found: " + adminId));

        List<Staff> recipients;
        if (body.get("staffId") != null) {
            Long staffId = Long.valueOf(body.get("staffId").toString());
            recipients = List.of(staffRepository.findById(staffId)
                    .orElseThrow(() -> new IllegalArgumentException("Staff not found: " + staffId)));
        } else {
            recipients = staffRepository.findAll();
        }

        return notificationService.sendJobPostingRequest(
                admin,
                recipients,
                (String) body.get("jobTitle"),
                requiredNumber(body, "salaryMin"),
                requiredNumber(body, "salaryMax"),
                body.get("deadline") != null ? LocalDate.parse(body.get("deadline").toString()) : null,
                (String) body.get("notes"));
    }

    private double requiredNumber(Map<String, Object> body, String key) {
        if (body.get(key) == null) {
            throw new IllegalArgumentException(key + " is required.");
        }
        try {
            return Double.parseDouble(body.get(key).toString());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException(key + " must be a number.");
        }
    }
}
