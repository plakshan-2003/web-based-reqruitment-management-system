package com.careerlink.backend.dto;

import com.careerlink.backend.entity.enums.ModerationDecision;
import java.time.LocalDateTime;

public class ModerationLogResponseDTO {
    private Long logId;
    private Long jobId;
    private Long adminId;
    private ModerationDecision decision;
    private String comments;
    private LocalDateTime timestamp;

    public Long getLogId() { return logId; }
    public void setLogId(Long logId) { this.logId = logId; }
    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }
    public Long getAdminId() { return adminId; }
    public void setAdminId(Long adminId) { this.adminId = adminId; }
    public ModerationDecision getDecision() { return decision; }
    public void setDecision(ModerationDecision decision) { this.decision = decision; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
