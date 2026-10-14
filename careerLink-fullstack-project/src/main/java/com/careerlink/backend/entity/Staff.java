package com.careerlink.backend.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;

/**
 * Staff - concrete subtype of User (ISA hierarchy in the EER diagram).
 * Own attributes: JobTitle, departmentName.
 * Relationships: Staff 1 --Posts--> N JobPosting,
 *                Staff 1 --Scheduled by--> N Interview.
 *
 * INHERITANCE + POLYMORPHISM: same base contract as JobSeeker/Admin, its
 * own implementation of getRole()/getDashboardSummary().
 */
@Entity
@DiscriminatorValue("STAFF")
public class Staff extends User {

    @Column(name = "job_title")
    private String jobTitle;

    @Column(name = "department_name")
    private String departmentName;

    @JsonIgnore
    @OneToMany(mappedBy = "staff", cascade = CascadeType.ALL)
    private List<JobPosting> jobPostings = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "staff", cascade = CascadeType.ALL)
    private List<Interview> interviews = new ArrayList<>();

    protected Staff() {
        super();
    }

    public Staff(String firstName, String lastName, String email, String passwordHash,
                 String jobTitle, String departmentName) {
        super(firstName, lastName, email, passwordHash);
        this.jobTitle = jobTitle;
        this.departmentName = departmentName;
    }

    @Override
    public String getRole() {
        return "STAFF";
    }

    @Override
    public String getDashboardSummary() {
        return String.format("%s (%s, %s) has %d job posting(s) and %d interview(s) scheduled.",
                getFullName(), jobTitle, departmentName, jobPostings.size(), interviews.size());
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public List<JobPosting> getJobPostings() {
        return jobPostings;
    }

    public List<Interview> getInterviews() {
        return interviews;
    }
}
