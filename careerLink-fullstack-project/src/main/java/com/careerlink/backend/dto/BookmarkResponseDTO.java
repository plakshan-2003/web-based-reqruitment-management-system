package com.careerlink.backend.dto;

import java.time.LocalDateTime;

public class BookmarkResponseDTO {
    private Long bookmarkId;
    private Long jobSeekerId;
    private Long jobPostingId;
    private LocalDateTime savedDate;

    public Long getBookmarkId() { return bookmarkId; }
    public void setBookmarkId(Long bookmarkId) { this.bookmarkId = bookmarkId; }
    public Long getJobSeekerId() { return jobSeekerId; }
    public void setJobSeekerId(Long jobSeekerId) { this.jobSeekerId = jobSeekerId; }
    public Long getJobPostingId() { return jobPostingId; }
    public void setJobPostingId(Long jobPostingId) { this.jobPostingId = jobPostingId; }
    public LocalDateTime getSavedDate() { return savedDate; }
    public void setSavedDate(LocalDateTime savedDate) { this.savedDate = savedDate; }
}
