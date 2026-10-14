package com.careerlink.backend.entity;

import com.careerlink.backend.entity.enums.InterviewStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Interview - per the EER diagram it is
 *   N --Scheduled by--> 1 Staff   (the staff member who runs the interview)
 *   N --Scheduled for--> 1 JobSeeker (the candidate being interviewed)
 */
@Entity
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "interview_id")
    private Long interviewId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_seeker_id", nullable = false)
    private JobSeeker jobSeeker;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

    @Column(name = "scheduled_date_time")
    private LocalDateTime scheduledDateTime;

    private String mode; // ONLINE, IN_PERSON, PHONE

    @Enumerated(EnumType.STRING)
    private InterviewStatus status;

    protected Interview() {
        this.status = InterviewStatus.SCHEDULED;
    }

    public Interview(JobSeeker jobSeeker, Staff staff, LocalDateTime scheduledDateTime, String mode) {
        this();
        this.jobSeeker = jobSeeker;
        this.staff = staff;
        this.scheduledDateTime = scheduledDateTime;
        this.mode = mode;
    }

    public Long getInterviewId() {
        return interviewId;
    }

    public JobSeeker getJobSeeker() {
        return jobSeeker;
    }

    public Staff getStaff() {
        return staff;
    }

    public LocalDateTime getScheduledDateTime() {
        return scheduledDateTime;
    }

    public void setScheduledDateTime(LocalDateTime scheduledDateTime) {
        this.scheduledDateTime = scheduledDateTime;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public InterviewStatus getStatus() {
        return status;
    }

    public void setStatus(InterviewStatus status) {
        this.status = status;
    }
}
