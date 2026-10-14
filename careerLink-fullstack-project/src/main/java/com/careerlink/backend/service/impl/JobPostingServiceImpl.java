package com.careerlink.backend.service.impl;

import com.careerlink.backend.exception.ResourceNotFoundException;
import com.careerlink.backend.entity.JobPosting;
import com.careerlink.backend.entity.Staff;
import com.careerlink.backend.entity.enums.JobStatus;
import com.careerlink.backend.repository.JobPostingRepository;
import com.careerlink.backend.service.JobPostingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class JobPostingServiceImpl implements JobPostingService {

    // DESIGN PATTERN: Repository Pattern (Database operations abstraction)
    private final JobPostingRepository jobPostingRepository;

    public JobPostingServiceImpl(JobPostingRepository jobPostingRepository) {
        this.jobPostingRepository = jobPostingRepository;
    }

    @Override
    public JobPosting createJobPosting(Staff staff, String title, String description, String category,
                                       String location, Double salary, LocalDate deadline,
                                       List<String> tags) {
        validateRequired(title, deadline);

        // DESIGN PATTERN: Builder Pattern usage for clean object creation
        JobPosting jobPosting = JobPosting.builder()
                .staff(staff)
                .title(title.trim())
                .description(description)
                .category(category)
                .location(location)
                .salary(salary)
                .deadline(deadline)
                .tags(tags != null ? tags : new ArrayList<>())
                .build();

        return jobPostingRepository.save(jobPosting);
    }

    @Override
    public JobPosting updateJobPosting(Long jobId, JobPosting updatedFields) {
        JobPosting existing = getOrThrow(jobId);
        existing.setTitle(updatedFields.getTitle());
        existing.setDescription(updatedFields.getDescription());
        existing.setCategory(updatedFields.getCategory());
        existing.setLocation(updatedFields.getLocation());
        existing.setSalary(updatedFields.getSalary());
        existing.setDeadline(updatedFields.getDeadline());
        return jobPostingRepository.save(existing);
    }

    @Override
    public JobPosting update(Long jobId, String title, String description, String category, String location,
                             Double salary, LocalDate deadline, List<String> tags) {
        JobPosting existing = getOrThrow(jobId);
        if (title != null) existing.setTitle(title.trim());
        if (description != null) existing.setDescription(description);
        if (category != null) existing.setCategory(category);
        if (location != null) existing.setLocation(location);
        if (salary != null) existing.setSalary(salary);
        if (deadline != null) existing.setDeadline(deadline);
        if (tags != null) existing.setTags(new ArrayList<>(tags));
        validateRequired(existing.getTitle(), existing.getDeadline());
        return jobPostingRepository.save(existing);
    }

    @Override
    public JobPosting getById(Long jobId) {
        return getOrThrow(jobId);
    }

    @Override
    public List<JobPosting> getByStatus(JobStatus status) {
        return jobPostingRepository.findByStatus(status);
    }

    @Override
    @Transactional
    public void delete(Long jobId) {
        jobPostingRepository.delete(getOrThrow(jobId));
    }

    // DESIGN PATTERN: State Pattern Logic
    // Manages state changes (PUBLISHED, UNPUBLISHED, ARCHIVED)

    @Override
    public JobPosting publish(Long jobId) {
        JobPosting jobPosting = getOrThrow(jobId);
        jobPosting.setStatus(JobStatus.PUBLISHED);
        return jobPostingRepository.save(jobPosting);
    }

    @Override
    public JobPosting unpublish(Long jobId) {
        JobPosting jobPosting = getOrThrow(jobId);
        jobPosting.setStatus(JobStatus.UNPUBLISHED);
        return jobPostingRepository.save(jobPosting);
    }

    @Override
    public JobPosting archive(Long jobId) {
        JobPosting jobPosting = getOrThrow(jobId);
        jobPosting.setStatus(JobStatus.ARCHIVED);
        return jobPostingRepository.save(jobPosting);
    }

    @Override
    public List<JobPosting> search(String keyword) {
        return jobPostingRepository.findByStatus(JobStatus.PUBLISHED).stream()
                .filter(job -> job.getTitle().toLowerCase().contains(keyword.toLowerCase())
                        || (job.getDescription() != null && job.getDescription().toLowerCase().contains(keyword.toLowerCase())))
                .toList();
    }

    @Override
    public List<JobPosting> search(String category, String location) {
        return jobPostingRepository.findByStatus(JobStatus.PUBLISHED).stream()
                .filter(job -> category == null || category.equalsIgnoreCase(job.getCategory()))
                .filter(job -> location == null || location.equalsIgnoreCase(job.getLocation()))
                .toList();
    }

    @Override
    public List<JobPosting> getByStaff(Long staffId) {
        return jobPostingRepository.findByStaffId(staffId);
    }

    private void validateRequired(String title, LocalDate deadline) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Job title is required.");
        }
        if (deadline == null) {
            throw new IllegalArgumentException("Application deadline is required.");
        }
        if (deadline.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Cannot create or schedule a job posting with a past deadline.");
        }
    }

    private JobPosting getOrThrow(Long jobId) {
        return jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found: " + jobId));
    }
}