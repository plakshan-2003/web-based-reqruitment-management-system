package com.careerlink.backend.dto;

import com.careerlink.backend.entity.enums.InterviewStatus;
import java.time.LocalDateTime;

public class InterviewResponseDTO {
    private Long interviewId;
    private Long jobSeekerId;
    private Long staffId;
    private LocalDateTime scheduledDateTime;
    private String mode;
    private InterviewStatus status;

    public Long getInterviewId() { return interviewId; }
    public void setInterviewId(Long interviewId) { this.interviewId = interviewId; }
    public Long getJobSeekerId() { return jobSeekerId; }
    public void setJobSeekerId(Long jobSeekerId) { this.jobSeekerId = jobSeekerId; }
    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }
    public LocalDateTime getScheduledDateTime() { return scheduledDateTime; }
    public void setScheduledDateTime(LocalDateTime scheduledDateTime) { this.scheduledDateTime = scheduledDateTime; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public InterviewStatus getStatus() { return status; }
    public void setStatus(InterviewStatus status) { this.status = status; }
}
