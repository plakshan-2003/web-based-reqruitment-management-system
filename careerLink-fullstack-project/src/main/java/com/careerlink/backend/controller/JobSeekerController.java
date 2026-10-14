package com.careerlink.backend.controller;

import com.careerlink.backend.exception.ResourceNotFoundException;
import com.careerlink.backend.entity.JobSeeker;
import com.careerlink.backend.entity.User;
import com.careerlink.backend.repository.JobSeekerRepository;
import com.careerlink.backend.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * Candidate profile. Create = POST /api/auth/register/job-seeker (FR-01).
 */
@RestController
@RequestMapping("/api/job-seekers")
public class JobSeekerController {

    private final JobSeekerRepository jobSeekerRepository;
    private final UserService userService;

    public JobSeekerController(JobSeekerRepository jobSeekerRepository, UserService userService) {
        this.jobSeekerRepository = jobSeekerRepository;
        this.userService = userService;
    }

    @GetMapping
    public List<JobSeeker> getAll() {
        return jobSeekerRepository.findAll();
    }

    @GetMapping("/{jobSeekerId}")
    public JobSeeker get(@PathVariable Long jobSeekerId) {
        return getOrThrow(jobSeekerId);
    }

    // body keys (all optional): firstName, lastName, profilePicture, bio,
    // emails (list), contactNumbers (list)
    @PutMapping("/{jobSeekerId}")
    public User update(@PathVariable Long jobSeekerId, @RequestBody Map<String, Object> body) {
        getOrThrow(jobSeekerId);
        return userService.updateProfile(jobSeekerId, body);
    }

    @DeleteMapping("/{jobSeekerId}")
    public Map<String, String> delete(@PathVariable Long jobSeekerId) {
        getOrThrow(jobSeekerId);
        userService.deleteUser(jobSeekerId);
        return Map.of("message", "Job seeker " + jobSeekerId + " deleted.");
    }

    private JobSeeker getOrThrow(Long jobSeekerId) {
        return jobSeekerRepository.findById(jobSeekerId)
                .orElseThrow(() -> new ResourceNotFoundException("Job seeker not found: " + jobSeekerId));
    }
}
