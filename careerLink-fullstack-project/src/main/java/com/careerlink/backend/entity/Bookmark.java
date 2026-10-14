package com.careerlink.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Bookmark - associative entity resolving the JobSeeker <-> JobPosting
 * M:N "Saves" relationship.
 */
@Entity
@Table(name = "bookmarks")
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bookmark_id")
    private Long bookmarkId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_seeker_id", nullable = false)
    private JobSeeker jobSeeker;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private JobPosting jobPosting;

    @Column(name = "saved_date")
    private LocalDateTime savedDate;

    protected Bookmark() {
        this.savedDate = LocalDateTime.now();
    }

    public Bookmark(JobSeeker jobSeeker, JobPosting jobPosting) {
        this();
        this.jobSeeker = jobSeeker;
        this.jobPosting = jobPosting;
    }

    public Long getBookmarkId() {
        return bookmarkId;
    }

    public JobSeeker getJobSeeker() {
        return jobSeeker;
    }

    public JobPosting getJobPosting() {
        return jobPosting;
    }

    public LocalDateTime getSavedDate() {
        return savedDate;
    }
}
