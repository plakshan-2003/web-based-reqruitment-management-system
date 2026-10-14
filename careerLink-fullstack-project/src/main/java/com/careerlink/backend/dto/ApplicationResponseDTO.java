package com.careerlink.backend.dto;

import com.careerlink.backend.entity.enums.ApplicationStatus;
import java.time.LocalDateTime;

public class ApplicationResponseDTO {
    private Long applicationId;
    private Long jobSeekerId;
    private Long jobPostingId;
    private LocalDateTime appliedDate;
    private ApplicationStatus status;

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }
    public Long getJobSeekerId() { return jobSeekerId; }
    public void setJobSeekerId(Long jobSeekerId) { this.jobSeekerId = jobSeekerId; }
    public Long getJobPostingId() { return jobPostingId; }
    public void setJobPostingId(Long jobPostingId) { this.jobPostingId = jobPostingId; }
    public LocalDateTime getAppliedDate() { return appliedDate; }
    public void setAppliedDate(LocalDateTime appliedDate) { this.appliedDate = appliedDate; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
}
