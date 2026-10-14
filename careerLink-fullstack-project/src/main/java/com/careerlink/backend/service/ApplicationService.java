package com.careerlink.backend.service;

import com.careerlink.backend.entity.Application;
import com.careerlink.backend.entity.CV;
import com.careerlink.backend.entity.JobPosting;
import com.careerlink.backend.entity.JobSeeker;
import com.careerlink.backend.entity.enums.ApplicationStatus;
import java.util.List;

public interface ApplicationService {

    Application apply(JobSeeker jobSeeker, JobPosting jobPosting);

    Application getById(Long applicationId);

    // FR-15: shortlist / reject / hire ... and notify the candidate (FR-16 / FR-23)
    Application updateStatus(Long applicationId, ApplicationStatus newStatus);

    Application withdraw(Long applicationId);

    // FR-17: remove an application from the pipeline
    void remove(Long applicationId);

    List<Application> getByJobSeeker(Long jobSeekerId);

    List<Application> getByJobPosting(Long jobId);

    // FR-14: CVs of the candidate behind one application / of every applicant on a listing
    List<CV> getCvsForApplication(Long applicationId);

    List<CV> getCvsForJob(Long jobId);
}
