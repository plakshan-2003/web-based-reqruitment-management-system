package com.careerlink.backend.controller;

import com.careerlink.backend.entity.Application;
import com.careerlink.backend.entity.CV;
import com.careerlink.backend.entity.JobPosting;
import com.careerlink.backend.entity.JobSeeker;
import com.careerlink.backend.entity.enums.ApplicationStatus;
import com.careerlink.backend.repository.JobPostingRepository;
import com.careerlink.backend.repository.JobSeekerRepository;
import com.careerlink.backend.service.ApplicationService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final JobSeekerRepository jobSeekerRepository;
    private final JobPostingRepository jobPostingRepository;

    public ApplicationController(ApplicationService applicationService,
                                  JobSeekerRepository jobSeekerRepository,
                                  JobPostingRepository jobPostingRepository) {
        this.applicationService = applicationService;
        this.jobSeekerRepository = jobSeekerRepository;
        this.jobPostingRepository = jobPostingRepository;
    }

    // FR-07
    @PostMapping
    public Application apply(@RequestParam Long jobSeekerId, @RequestParam Long jobId) {
        JobSeeker jobSeeker = jobSeekerRepository.findById(jobSeekerId)
                .orElseThrow(() -> new IllegalArgumentException("Job seeker not found: " + jobSeekerId));
        JobPosting jobPosting = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found: " + jobId));
        return applicationService.apply(jobSeeker, jobPosting);
    }

    @GetMapping("/{applicationId}")
    public Application get(@PathVariable Long applicationId) {
        return applicationService.getById(applicationId);
    }

    // FR-15
    @PutMapping("/{applicationId}/status")
    public Application updateStatus(@PathVariable Long applicationId, @RequestParam ApplicationStatus status) {
        return applicationService.updateStatus(applicationId, status);
    }

    // FR-08
    @GetMapping("/job-seeker/{jobSeekerId}")
    public List<Application> byJobSeeker(@PathVariable Long jobSeekerId) {
        return applicationService.getByJobSeeker(jobSeekerId);
    }

    @GetMapping("/job/{jobId}")
    public List<Application> byJobPosting(@PathVariable Long jobId) {
        return applicationService.getByJobPosting(jobId);
    }

    // candidate withdraws their own application
    @PutMapping("/{applicationId}/withdraw")
    public Application withdraw(@PathVariable Long applicationId) {
        return applicationService.withdraw(applicationId);
    }

    // FR-14: CVs of the candidate behind one application / of all applicants on a listing
    @GetMapping("/{applicationId}/cvs")
    public List<CV> cvsForApplication(@PathVariable Long applicationId) {
        return applicationService.getCvsForApplication(applicationId);
    }

    @GetMapping("/job/{jobId}/cvs")
    public List<CV> cvsForJob(@PathVariable Long jobId) {
        return applicationService.getCvsForJob(jobId);
    }

    // FR-17
    @DeleteMapping("/{applicationId}")
    public Map<String, String> remove(@PathVariable Long applicationId) {
        applicationService.remove(applicationId);
        return Map.of("message", "Application " + applicationId + " removed.");
    }
}
