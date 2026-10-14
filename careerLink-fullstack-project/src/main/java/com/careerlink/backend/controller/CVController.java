package com.careerlink.backend.controller;

import com.careerlink.backend.entity.CV;
import com.careerlink.backend.entity.JobSeeker;
import com.careerlink.backend.repository.JobSeekerRepository;
import com.careerlink.backend.service.CVService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cvs")
public class CVController {

    private final CVService cvService;
    private final JobSeekerRepository jobSeekerRepository;

    public CVController(CVService cvService, JobSeekerRepository jobSeekerRepository) {
        this.cvService = cvService;
        this.jobSeekerRepository = jobSeekerRepository;
    }

    // FR-05
    @PostMapping("/job-seeker/{jobSeekerId}")
    public CV upload(@PathVariable Long jobSeekerId, @RequestBody Map<String, String> body) {
        JobSeeker jobSeeker = jobSeekerRepository.findById(jobSeekerId)
                .orElseThrow(() -> new IllegalArgumentException("Job seeker not found: " + jobSeekerId));
        return cvService.upload(jobSeeker, body.get("fileUrl"), body.get("fileFormat"));
    }

    @PutMapping("/{cvId}")
    public CV update(@PathVariable Long cvId, @RequestBody Map<String, String> body) {
        return cvService.update(cvId, body.get("fileUrl"), body.get("fileFormat"));
    }

    @GetMapping("/{cvId}")
    public CV get(@PathVariable Long cvId) {
        return cvService.getById(cvId);
    }

    @DeleteMapping("/{cvId}")
    public Map<String, String> delete(@PathVariable Long cvId) {
        cvService.delete(cvId);
        return Map.of("message", "CV " + cvId + " deleted.");
    }

    @GetMapping("/job-seeker/{jobSeekerId}")
    public List<CV> byJobSeeker(@PathVariable Long jobSeekerId) {
        return cvService.getByJobSeeker(jobSeekerId);
    }
}
