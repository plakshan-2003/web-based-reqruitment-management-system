package com.careerlink.backend.service.impl;

import com.careerlink.backend.exception.ResourceNotFoundException;
import com.careerlink.backend.entity.Application;
import com.careerlink.backend.entity.CV;
import com.careerlink.backend.entity.JobPosting;
import com.careerlink.backend.entity.JobSeeker;
import com.careerlink.backend.entity.enums.ApplicationStatus;
import com.careerlink.backend.entity.enums.NotificationType;
import com.careerlink.backend.repository.ApplicationRepository;
import com.careerlink.backend.repository.CVRepository;
import com.careerlink.backend.service.ApplicationService;
import com.careerlink.backend.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final CVRepository cvRepository;
    private final NotificationService notificationService;

    public ApplicationServiceImpl(ApplicationRepository applicationRepository,
                                  CVRepository cvRepository,
                                  NotificationService notificationService) {
        this.applicationRepository = applicationRepository;
        this.cvRepository = cvRepository;
        this.notificationService = notificationService;
    }

    @Override
    public Application apply(JobSeeker jobSeeker, JobPosting jobPosting) {
        if (jobSeeker.getCvs() == null || jobSeeker.getCvs().isEmpty()) {
            throw new IllegalArgumentException("Cannot apply for a job without an uploaded CV.");
        }
        
        if (jobSeeker.getDateOfBirth() == null) {
            throw new IllegalArgumentException("Date of birth must be provided to apply for a job.");
        }
        
        if (java.time.Period.between(jobSeeker.getDateOfBirth(), java.time.LocalDate.now()).getYears() < 18) {
            throw new IllegalArgumentException("You must be at least 18 years old to apply for a job.");
        }

        Application application = new Application(jobSeeker, jobPosting);
        return applicationRepository.save(application);
    }

    @Override
    public Application getById(Long applicationId) {
        return getOrThrow(applicationId);
    }

    @Override
    @Transactional
    public Application updateStatus(Long applicationId, ApplicationStatus newStatus) {
        Application application = getOrThrow(applicationId);
        application.setStatus(newStatus);
        Application saved = applicationRepository.save(application);

        // FR-23: the candidate is told whenever their application changes status
        notificationService.send(application.getJobSeeker(),
                String.format("Your application for \"%s\" is now %s.",
                        application.getJobPosting().getTitle(), newStatus),
                NotificationType.APPLICATION_STATUS);
        return saved;
    }

    @Override
    @Transactional
    public Application withdraw(Long applicationId) {
        Application application = getOrThrow(applicationId);
        application.setStatus(ApplicationStatus.WITHDRAWN);
        Application saved = applicationRepository.save(application);

        // the staff member who posted the listing is the other party involved
        notificationService.send(application.getJobPosting().getStaff(),
                String.format("%s withdrew their application for \"%s\".",
                        application.getJobSeeker().getFullName(), application.getJobPosting().getTitle()),
                NotificationType.APPLICATION_STATUS);
        return saved;
    }

    @Override
    @Transactional
    public void remove(Long applicationId) {
        Application application = getOrThrow(applicationId);
        applicationRepository.delete(application);
    }

    @Override
    public List<Application> getByJobSeeker(Long jobSeekerId) {
        return applicationRepository.findByJobSeeker_UserId(jobSeekerId);
    }

    @Override
    public List<Application> getByJobPosting(Long jobId) {
        return applicationRepository.findByJobPosting_JobId(jobId);
    }

    @Override
    @Transactional
    public List<CV> getCvsForApplication(Long applicationId) {
        Application application = getOrThrow(applicationId);
        return cvRepository.findByJobSeeker_UserId(application.getJobSeeker().getUserId());
    }

    @Override
    @Transactional
    public List<CV> getCvsForJob(Long jobId) {
        List<CV> cvs = new ArrayList<>();
        for (Application application : applicationRepository.findByJobPosting_JobId(jobId)) {
            cvs.addAll(cvRepository.findByJobSeeker_UserId(application.getJobSeeker().getUserId()));
        }
        return cvs;
    }

    private Application getOrThrow(Long applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + applicationId));
    }
}
