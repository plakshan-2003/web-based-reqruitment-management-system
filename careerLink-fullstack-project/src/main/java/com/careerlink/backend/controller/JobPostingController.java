package com.careerlink.backend.controller;

import com.careerlink.backend.dto.JobPostingRequestDTO;
import com.careerlink.backend.entity.JobPosting;
import com.careerlink.backend.entity.Staff;
import com.careerlink.backend.entity.enums.JobStatus;
import com.careerlink.backend.repository.StaffRepository;
import com.careerlink.backend.service.JobPostingService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobPostingController {

    private final JobPostingService jobPostingService;
    private final StaffRepository staffRepository;

    public JobPostingController(JobPostingService jobPostingService, StaffRepository staffRepository) {
        this.jobPostingService = jobPostingService;
        this.staffRepository = staffRepository;
    }

    @PostMapping("/staff/{staffId}")
    public JobPosting create(@PathVariable Long staffId, @RequestBody JobPostingRequestDTO dto) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found: " + staffId));

        return jobPostingService.createJobPosting(
                staff,
                dto.getTitle(),
                dto.getDescription(),
                dto.getCategory(),
                dto.getLocation(),
                dto.getSalary(),
                dto.getDeadline(),
                dto.getTags() != null ? dto.getTags() : List.of()
        );
    }

    // list by status - defaults to PUBLISHED (the public job board)
    @GetMapping
    public List<JobPosting> list(@RequestParam(defaultValue = "PUBLISHED") JobStatus status) {
        return jobPostingService.getByStatus(status);
    }

    // FR-06: overloaded search - keyword OR structured filters (category, location)
    @GetMapping("/search")
    public List<JobPosting> search(@RequestParam(required = false) String keyword,
                                   @RequestParam(required = false) String category,
                                   @RequestParam(required = false) String location) {
        if (keyword != null) {
            return jobPostingService.search(keyword);
        }
        return jobPostingService.search(category, location);
    }

    @GetMapping("/staff/{staffId}")
    public List<JobPosting> byStaff(@PathVariable Long staffId) {
        return jobPostingService.getByStaff(staffId);
    }

    @GetMapping("/{jobId}")
    public JobPosting get(@PathVariable Long jobId) {
        return jobPostingService.getById(jobId);
    }

    // FR-11: partial update using DTO
    @PutMapping("/{jobId}")
    public JobPosting update(@PathVariable Long jobId, @RequestBody JobPostingRequestDTO dto) {
        return jobPostingService.update(
                jobId,
                dto.getTitle(),
                dto.getDescription(),
                dto.getCategory(),
                dto.getLocation(),
                dto.getSalary(),
                dto.getDeadline(),
                dto.getTags()
        );
    }

    // DESIGN PATTERN: State Pattern Methods
    // (Handles Job Status transitions like Publish, Unpublish, Archive)

    @PutMapping("/{jobId}/publish")
    public JobPosting publish(@PathVariable Long jobId) {
        return jobPostingService.publish(jobId);
    }

    @PutMapping("/{jobId}/unpublish")
    public JobPosting unpublish(@PathVariable Long jobId) {
        return jobPostingService.unpublish(jobId);
    }

    @PutMapping("/{jobId}/archive")
    public JobPosting archive(@PathVariable Long jobId) {
        return jobPostingService.archive(jobId);
    }

    // FR-13 (hard delete; archive is the soft option)
    @DeleteMapping("/{jobId}")
    public Map<String, String> delete(@PathVariable Long jobId) {
        jobPostingService.delete(jobId);
        return Map.of("message", "Job posting " + jobId + " deleted.");
    }
}