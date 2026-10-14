package com.careerlink.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * CV - weak entity in the EER model; cannot exist without an owning
 * JobSeeker (CVID is a partial key, JobSeeker is the identifying owner).
 * ENCAPSULATION: private fields, controlled access only via accessors.
 */
@Entity
@Table(name = "cvs")
public class CV {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cv_id")
    private Long cvId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_seeker_id", nullable = false)
    private JobSeeker jobSeeker;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    @Column(name = "file_format")
    private String fileFormat;

    @Column(name = "upload_date")
    private LocalDateTime uploadDate;

    protected CV() {
        this.uploadDate = LocalDateTime.now();
    }

    public CV(JobSeeker jobSeeker, String fileUrl, String fileFormat) {
        this();
        this.jobSeeker = jobSeeker;
        this.fileUrl = fileUrl;
        this.fileFormat = fileFormat;
    }

    public Long getCvId() {
        return cvId;
    }

    public JobSeeker getJobSeeker() {
        return jobSeeker;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
        this.uploadDate = LocalDateTime.now();
    }

    public String getFileFormat() {
        return fileFormat;
    }

    public void setFileFormat(String fileFormat) {
        this.fileFormat = fileFormat;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }
}
