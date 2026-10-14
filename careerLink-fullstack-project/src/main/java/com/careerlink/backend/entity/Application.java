package com.careerlink.backend.entity;

import com.careerlink.backend.entity.enums.ApplicationStatus;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

/**
 * Application - associative entity resolving the JobSeeker <-> JobPosting
 * M:N "Applies" relationship (ApplicationID, Status, AppliedDate).
 */
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long applicationId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_seeker_id", nullable = false)
    private JobSeeker jobSeeker;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private JobPosting jobPosting;

    @Column(name = "applied_date")
    private LocalDateTime appliedDate;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    protected Application() {
        this.appliedDate = LocalDateTime.now();
        this.status = ApplicationStatus.SUBMITTED;
    }

    public Application(JobSeeker jobSeeker, JobPosting jobPosting) {
        this();
        this.jobSeeker = jobSeeker;
        this.jobPosting = jobPosting;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public JobSeeker getJobSeeker() {
        return jobSeeker;
    }

    public JobPosting getJobPosting() {
        return jobPosting;
    }

    public LocalDateTime getAppliedDate() {
        return appliedDate;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
}
