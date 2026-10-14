package com.careerlink.backend.service.impl;

import com.careerlink.backend.exception.ResourceNotFoundException;
import com.careerlink.backend.entity.Admin;
import com.careerlink.backend.entity.JobPosting;
import com.careerlink.backend.entity.ModerationLog;
import com.careerlink.backend.entity.enums.JobStatus;
import com.careerlink.backend.entity.enums.ModerationDecision;
import com.careerlink.backend.entity.enums.NotificationType;
import com.careerlink.backend.repository.JobPostingRepository;
import com.careerlink.backend.repository.ModerationLogRepository;
import com.careerlink.backend.service.ModerationService;
import com.careerlink.backend.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ModerationServiceImpl implements ModerationService {

    private final ModerationLogRepository moderationLogRepository;
    private final JobPostingRepository jobPostingRepository;
    private final NotificationService notificationService;

    public ModerationServiceImpl(ModerationLogRepository moderationLogRepository,
                                 JobPostingRepository jobPostingRepository,
                                 NotificationService notificationService) {
        this.moderationLogRepository = moderationLogRepository;
        this.jobPostingRepository = jobPostingRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public ModerationLog approve(Admin admin, JobPosting jobPosting, String comments) {
        jobPosting.setStatus(JobStatus.PUBLISHED);
        jobPostingRepository.save(jobPosting);
        ModerationLog log = moderationLogRepository.save(
                new ModerationLog(admin, jobPosting, ModerationDecision.APPROVED, comments));
        notifyStaff(jobPosting, "approved", comments);
        return log;
    }

    @Override
    @Transactional
    public ModerationLog reject(Admin admin, JobPosting jobPosting, String comments) {
        jobPosting.setStatus(JobStatus.UNPUBLISHED);
        jobPostingRepository.save(jobPosting);
        ModerationLog log = moderationLogRepository.save(
                new ModerationLog(admin, jobPosting, ModerationDecision.REJECTED, comments));
        notifyStaff(jobPosting, "rejected", comments);
        return log;
    }

    @Override
    public List<ModerationLog> getHistoryForJob(Long jobId) {
        return moderationLogRepository.findByJobPosting_JobId(jobId);
    }

    @Override
    public List<ModerationLog> getAll() {
        return moderationLogRepository.findAll();
    }

    @Override
    public List<ModerationLog> getByAdmin(Long adminId) {
        return moderationLogRepository.findByAdmin_UserId(adminId);
    }

    @Override
    public ModerationLog getById(Long logId) {
        return moderationLogRepository.findById(logId)
                .orElseThrow(() -> new ResourceNotFoundException("Moderation log not found: " + logId));
    }

    @Override
    public ModerationLog updateComments(Long logId, String comments) {
        ModerationLog log = getById(logId);
        log.setComments(comments);
        return moderationLogRepository.save(log);
    }

    @Override
    public void delete(Long logId) {
        moderationLogRepository.delete(getById(logId));
    }

    // FR-23: the staff member who posted the listing hears about the decision
    private void notifyStaff(JobPosting jobPosting, String decision, String comments) {
        String message = String.format("Your job post \"%s\" was %s by an admin.", jobPosting.getTitle(), decision);
        if (comments != null && !comments.isBlank()) {
            message += " Comments: " + comments;
        }
        notificationService.send(jobPosting.getStaff(), message, NotificationType.JOB_MODERATION);
    }
}
