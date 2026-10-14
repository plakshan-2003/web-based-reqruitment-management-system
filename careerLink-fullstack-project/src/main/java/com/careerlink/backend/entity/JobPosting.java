package com.careerlink.backend.entity;

import com.careerlink.backend.entity.enums.JobStatus;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "job_postings")
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Long jobId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

    @Column(nullable = false)
    private String title;

    @Column(length = 3000)
    private String description;

    private String category;

    private String location;

    private Double salary;

    private LocalDate deadline;

    @Enumerated(EnumType.STRING)
    private JobStatus status;

    @Column(name = "posted_date")
    private LocalDateTime postedDate;

    // multivalued attribute Tags -> its own collection table
    @ElementCollection
    @CollectionTable(name = "job_posting_tags", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "jobPosting", cascade = CascadeType.ALL)
    private List<Application> applications = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "jobPosting", cascade = CascadeType.ALL)
    private List<Bookmark> bookmarks = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "jobPosting", cascade = CascadeType.ALL)
    private List<ModerationLog> moderationLogs = new ArrayList<>();

    protected JobPosting() {
        this.status = JobStatus.DRAFT;
        this.postedDate = LocalDateTime.now();
    }

    public JobPosting(Staff staff, String title, String description, String category,
                      String location, Double salary, LocalDate deadline) {
        this();
        this.staff = staff;
        this.title = title;
        this.description = description;
        this.category = category;
        this.location = location;
        this.salary = salary;
        this.deadline = deadline;
    }

    // DESIGN PATTERN: Builder Pattern Implementation

    public static class Builder {
        private Staff staff;
        private String title;
        private String description;
        private String category;
        private String location;
        private Double salary;
        private LocalDate deadline;
        private List<String> tags = new ArrayList<>();

        public Builder staff(Staff staff) {
            this.staff = staff;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder category(String category) {
            this.category = category;
            return this;
        }

        public Builder location(String location) {
            this.location = location;
            return this;
        }

        public Builder salary(Double salary) {
            this.salary = salary;
            return this;
        }

        public Builder deadline(LocalDate deadline) {
            this.deadline = deadline;
            return this;
        }

        public Builder tags(List<String> tags) {
            this.tags = tags != null ? tags : new ArrayList<>();
            return this;
        }

        public JobPosting build() {
            JobPosting jobPosting = new JobPosting(staff, title, description, category, location, salary, deadline);
            if (tags != null && !tags.isEmpty()) {
                jobPosting.setTags(tags);
            }
            return jobPosting;
        }
    }

    public static Builder builder() {
        return new Builder();
    }
    // ==========================================

    public Long getJobId() {
        return jobId;
    }

    public Staff getStaff() {
        return staff;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public LocalDateTime getPostedDate() {
        return postedDate;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<Application> getApplications() {
        return applications;
    }

    public List<Bookmark> getBookmarks() {
        return bookmarks;
    }

    public List<ModerationLog> getModerationLogs() {
        return moderationLogs;
    }
}