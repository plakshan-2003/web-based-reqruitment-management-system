package com.careerlink.backend.service;

import com.careerlink.backend.entity.Interview;
import com.careerlink.backend.entity.JobSeeker;
import com.careerlink.backend.entity.Staff;
import java.time.LocalDateTime;
import java.util.List;

public interface InterviewService {

    // FR-18 / FR-19: a staff member schedules an interview for a job seeker; the candidate is notified
    Interview schedule(JobSeeker jobSeeker, Staff staff, LocalDateTime dateTime, String mode);

    Interview getById(Long interviewId);

    // partial update - null keeps the current value
    Interview update(Long interviewId, LocalDateTime dateTime, String mode);

    // FR-20
    Interview reschedule(Long interviewId, LocalDateTime newDateTime);

    Interview cancel(Long interviewId);

    Interview complete(Long interviewId);

    void delete(Long interviewId);

    List<Interview> getByStaff(Long staffId);

    List<Interview> getByJobSeeker(Long jobSeekerId);
}
