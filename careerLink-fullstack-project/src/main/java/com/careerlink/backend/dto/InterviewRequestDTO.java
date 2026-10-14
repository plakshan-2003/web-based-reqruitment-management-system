package com.careerlink.backend.dto;

import java.time.LocalDateTime;

public class InterviewRequestDTO {
    private LocalDateTime scheduledDateTime;
    private String mode;

    public LocalDateTime getScheduledDateTime() { return scheduledDateTime; }
    public void setScheduledDateTime(LocalDateTime scheduledDateTime) { this.scheduledDateTime = scheduledDateTime; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
}
