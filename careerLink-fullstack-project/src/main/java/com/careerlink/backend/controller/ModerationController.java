package com.careerlink.backend.controller;

import com.careerlink.backend.entity.Admin;
import com.careerlink.backend.entity.JobPosting;
import com.careerlink.backend.entity.ModerationLog;
import com.careerlink.backend.repository.AdminRepository;
import com.careerlink.backend.repository.JobPostingRepository;
import com.careerlink.backend.service.ModerationService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/moderation")
public class ModerationController {

    private final ModerationService moderationService;
    private final AdminRepository adminRepository;
    private final JobPostingRepository jobPostingRepository;

    public ModerationController(ModerationService moderationService, AdminRepository adminRepository,
                                 JobPostingRepository jobPostingRepository) {
        this.moderationService = moderationService;
        this.adminRepository = adminRepository;
        this.jobPostingRepository = jobPostingRepository;
    }

    // FR-21
    @PostMapping("/{jobId}/approve")
    public ModerationLog approve(@PathVariable Long jobId, @RequestParam Long adminId,
                                  @RequestBody(required = false) Map<String, String> body) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found: " + adminId));
        JobPosting jobPosting = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found: " + jobId));
        String comments = body != null ? body.get("comments") : null;
        return moderationService.approve(admin, jobPosting, comments);
    }

    @PostMapping("/{jobId}/reject")
    public ModerationLog reject(@PathVariable Long jobId, @RequestParam Long adminId,
                                 @RequestBody(required = false) Map<String, String> body) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found: " + adminId));
        JobPosting jobPosting = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found: " + jobId));
        String comments = body != null ? body.get("comments") : null;
        return moderationService.reject(admin, jobPosting, comments);
    }

    @GetMapping("/{jobId}/history")
    public List<ModerationLog> history(@PathVariable Long jobId) {
        return moderationService.getHistoryForJob(jobId);
    }

    // ---- moderation log (admin activity log) ----
    @GetMapping("/logs")
    public List<ModerationLog> allLogs() {
        return moderationService.getAll();
    }

    @GetMapping("/logs/{logId}")
    public ModerationLog getLog(@PathVariable Long logId) {
        return moderationService.getById(logId);
    }

    @GetMapping("/logs/admin/{adminId}")
    public List<ModerationLog> logsByAdmin(@PathVariable Long adminId) {
        return moderationService.getByAdmin(adminId);
    }

    @PutMapping("/logs/{logId}")
    public ModerationLog updateLogComments(@PathVariable Long logId, @RequestBody Map<String, String> body) {
        return moderationService.updateComments(logId, body.get("comments"));
    }

    @DeleteMapping("/logs/{logId}")
    public Map<String, String> deleteLog(@PathVariable Long logId) {
        moderationService.delete(logId);
        return Map.of("message", "Moderation log " + logId + " deleted.");
    }
}
