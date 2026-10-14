package com.careerlink.backend.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;

/**
 * JobSeeker - concrete subtype of User (ISA hierarchy).
 * INHERITANCE: reuses every field/method already defined on User.
 * POLYMORPHISM: overrides getRole()/getDashboardSummary() with its own
 * behaviour - calling code that only knows about `User` still gets the
 * JobSeeker-specific answer at runtime.
 */
@Entity
@DiscriminatorValue("JOB_SEEKER")
public class JobSeeker extends User {

    @Column(length = 1000)
    private String bio;

    @Column(name = "date_of_birth")
    private java.time.LocalDate dateOfBirth;

    @JsonIgnore
    @OneToMany(mappedBy = "jobSeeker", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CV> cvs = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "jobSeeker", cascade = CascadeType.ALL)
    private List<Application> applications = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "jobSeeker", cascade = CascadeType.ALL)
    private List<Bookmark> bookmarks = new ArrayList<>();

    // Interview N --Scheduled for--> 1 JobSeeker
    @JsonIgnore
    @OneToMany(mappedBy = "jobSeeker", cascade = CascadeType.ALL)
    private List<Interview> interviews = new ArrayList<>();

    protected JobSeeker() {
        super();
    }

    public JobSeeker(String firstName, String lastName, String email, String passwordHash) {
        super(firstName, lastName, email, passwordHash);
    }

    @Override
    public String getRole() {
        return "JOB_SEEKER";
    }

    @Override
    public String getDashboardSummary() {
        return String.format("%s has %d application(s), %d saved job(s) and %d interview(s).",
                getFullName(), applications.size(), bookmarks.size(), interviews.size());
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public java.time.LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(java.time.LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public List<CV> getCvs() {
        return cvs;
    }

    public List<Application> getApplications() {
        return applications;
    }

    public List<Bookmark> getBookmarks() {
        return bookmarks;
    }

    public List<Interview> getInterviews() {
        return interviews;
    }
}
