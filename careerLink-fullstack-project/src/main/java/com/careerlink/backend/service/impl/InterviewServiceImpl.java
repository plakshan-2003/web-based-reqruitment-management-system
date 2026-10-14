package com.careerlink.backend.service.impl;

import com.careerlink.backend.exception.ResourceNotFoundException;
import com.careerlink.backend.entity.Interview;
import com.careerlink.backend.entity.JobSeeker;
import com.careerlink.backend.entity.Staff;
import com.careerlink.backend.entity.enums.InterviewStatus;
import com.careerlink.backend.entity.enums.NotificationType;
import com.careerlink.backend.repository.InterviewRepository;
import com.careerlink.backend.service.InterviewService;
import com.careerlink.backend.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class InterviewServiceImpl implements InterviewService {

    private static final Set<String> MODES = Set.of("ONLINE", "IN_PERSON", "PHONE");

    private final InterviewRepository interviewRepository;
    private final NotificationService notificationService;

    public InterviewServiceImpl(InterviewRepository interviewRepository, NotificationService notificationService) {
        this.interviewRepository = interviewRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public Interview schedule(JobSeeker jobSeeker, Staff staff, LocalDateTime dateTime, String mode) {
        if (dateTime == null) {
            throw new IllegalArgumentException("Interview date and time is required.");
        }
        if (dateTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Cannot schedule an interview in the past.");
        }
        Interview saved = interviewRepository.save(new Interview(jobSeeker, staff, dateTime, normaliseMode(mode)));
        notifyCandidate(saved, "Interview scheduled");
        return saved;
    }

    @Override
    public Interview getById(Long interviewId) {
        return getOrThrow(interviewId);
    }

    @Override
    @Transactional
    public Interview update(Long interviewId, LocalDateTime dateTime, String mode) {
        Interview interview = getOrThrow(interviewId);
        assertOpen(interview);
        if (mode != null) {
            interview.setMode(normaliseMode(mode));
        }
        if (dateTime != null) {
            if (dateTime.isBefore(LocalDateTime.now())) {
                throw new IllegalArgumentException("Cannot schedule an interview in the past.");
            }
            interview.setScheduledDateTime(dateTime);
            interview.setStatus(InterviewStatus.RESCHEDULED);
        }
        Interview saved = interviewRepository.save(interview);
        notifyCandidate(saved, "Interview updated");
        return saved;
    }

    @Override
    @Transactional
    public Interview reschedule(Long interviewId, LocalDateTime newDateTime) {
        if (newDateTime == null) {
            throw new IllegalArgumentException("New interview date and time is required.");
        }
        if (newDateTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Cannot schedule an interview in the past.");
        }
        Interview interview = getOrThrow(interviewId);
        assertOpen(interview);
        interview.setScheduledDateTime(newDateTime);
        interview.setStatus(InterviewStatus.RESCHEDULED);
        Interview saved = interviewRepository.save(interview);
        notifyCandidate(saved, "Interview rescheduled");
        return saved;
    }

    @Override
    @Transactional
    public Interview cancel(Long interviewId) {
        Interview interview = getOrThrow(interviewId);
        interview.setStatus(InterviewStatus.CANCELLED);
        Interview saved = interviewRepository.save(interview);
        notifyCandidate(saved, "Interview cancelled");
        return saved;
    }

    @Override
    public Interview complete(Long interviewId) {
        Interview interview = getOrThrow(interviewId);
        interview.setStatus(InterviewStatus.COMPLETED);
        return interviewRepository.save(interview);
    }

    @Override
    public void delete(Long interviewId) {
        interviewRepository.delete(getOrThrow(interviewId));
    }

    @Override
    public List<Interview> getByStaff(Long staffId) {
        return interviewRepository.findByStaff_UserId(staffId);
    }

    @Override
    public List<Interview> getByJobSeeker(Long jobSeekerId) {
        return interviewRepository.findByJobSeeker_UserId(jobSeekerId);
    }

    private void assertOpen(Interview interview) {
        if (interview.getStatus() == InterviewStatus.CANCELLED || interview.getStatus() == InterviewStatus.COMPLETED) {
            throw new IllegalStateException("A " + interview.getStatus() + " interview cannot be changed.");
        }
    }

    private String normaliseMode(String mode) {
        if (mode == null || !MODES.contains(mode.trim().toUpperCase())) {
            throw new IllegalArgumentException("Interview mode must be one of " + MODES + ".");
        }
        return mode.trim().toUpperCase();
    }

    // FR-19 / FR-23: invitation + every later change goes to the candidate
    private void notifyCandidate(Interview interview, String headline) {
        notificationService.send(interview.getJobSeeker(),
                String.format("%s with %s: %s (%s).", headline, interview.getStaff().getFullName(),
                        interview.getScheduledDateTime(), interview.getMode()),
                NotificationType.INTERVIEW_UPDATE);
    }

    private Interview getOrThrow(Long interviewId) {
        return interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found: " + interviewId));
    }
}
