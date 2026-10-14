package com.careerlink.backend.service;

import com.careerlink.backend.entity.JobPosting;
import com.careerlink.backend.entity.Staff;
import com.careerlink.backend.entity.enums.JobStatus;
import java.time.LocalDate;
import java.util.List;

public interface JobPostingService {

    JobPosting createJobPosting(Staff staff, String title, String description, String category,
                                 String location, Double salary, LocalDate deadline,
                                 List<String> tags);

    JobPosting updateJobPosting(Long jobId, JobPosting updatedFields);

    // FR-11: partial update - any argument left null keeps its current value.
    JobPosting update(Long jobId, String title, String description, String category, String location,
                      Double salary, LocalDate deadline, List<String> tags);

    JobPosting getById(Long jobId);

    List<JobPosting> getByStatus(JobStatus status);

    // FR-13: permanent removal (archive() is the soft alternative).
    void delete(Long jobId);

    JobPosting publish(Long jobId);

    JobPosting unpublish(Long jobId);

    JobPosting archive(Long jobId);

    // OVERLOADING (compile-time polymorphism): two "search" entry points
    // with different parameter lists resolved by the compiler, not the JVM.
    List<JobPosting> search(String keyword);

    List<JobPosting> search(String category, String location);

    List<JobPosting> getByStaff(Long staffId);
}
