package com.careerlink.backend.controller;

import com.careerlink.backend.entity.Bookmark;
import com.careerlink.backend.entity.JobPosting;
import com.careerlink.backend.entity.JobSeeker;
import com.careerlink.backend.repository.JobPostingRepository;
import com.careerlink.backend.repository.JobSeekerRepository;
import com.careerlink.backend.service.BookmarkService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;
    private final JobSeekerRepository jobSeekerRepository;
    private final JobPostingRepository jobPostingRepository;

    public BookmarkController(BookmarkService bookmarkService, JobSeekerRepository jobSeekerRepository,
                               JobPostingRepository jobPostingRepository) {
        this.bookmarkService = bookmarkService;
        this.jobSeekerRepository = jobSeekerRepository;
        this.jobPostingRepository = jobPostingRepository;
    }

    // FR-09
    @PostMapping
    public Bookmark save(@RequestParam Long jobSeekerId, @RequestParam Long jobId) {
        JobSeeker jobSeeker = jobSeekerRepository.findById(jobSeekerId)
                .orElseThrow(() -> new IllegalArgumentException("Job seeker not found: " + jobSeekerId));
        JobPosting jobPosting = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found: " + jobId));
        return bookmarkService.save(jobSeeker, jobPosting);
    }

    @DeleteMapping
    public void remove(@RequestParam Long jobSeekerId, @RequestParam Long jobId) {
        bookmarkService.remove(jobSeekerId, jobId);
    }

    @GetMapping("/job-seeker/{jobSeekerId}")
    public List<Bookmark> byJobSeeker(@PathVariable Long jobSeekerId) {
        return bookmarkService.getByJobSeeker(jobSeekerId);
    }
}
