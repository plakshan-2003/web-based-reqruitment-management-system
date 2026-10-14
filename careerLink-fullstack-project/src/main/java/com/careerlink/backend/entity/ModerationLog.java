package com.careerlink.backend.entity;

import com.careerlink.backend.entity.enums.ModerationDecision;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * ModerationLog - associative entity carrying the attributes of the
 * Admin <-> JobPosting "Moderates" relationship.
 */
@Entity
@Table(name = "moderation_logs")
public class ModerationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private JobPosting jobPosting;

    @Enumerated(EnumType.STRING)
    private ModerationDecision decision;

    @Column(length = 1000)
    private String comments;

    @Column(name = "moderated_date")
    private LocalDateTime moderatedDate;

    protected ModerationLog() {
        this.moderatedDate = LocalDateTime.now();
    }

    public ModerationLog(Admin admin, JobPosting jobPosting, ModerationDecision decision, String comments) {
        this();
        this.admin = admin;
        this.jobPosting = jobPosting;
        this.decision = decision;
        this.comments = comments;
    }

    public Long getLogId() {
        return logId;
    }

    public Admin getAdmin() {
        return admin;
    }

    public JobPosting getJobPosting() {
        return jobPosting;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public ModerationDecision getDecision() {
        return decision;
    }

    public String getComments() {
        return comments;
    }

    public LocalDateTime getModeratedDate() {
        return moderatedDate;
    }
}
