package com.careerlink.backend.repository;

import com.careerlink.backend.entity.JobPosting;
import com.careerlink.backend.entity.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {

    List<JobPosting> findByStatus(JobStatus status);
    @Query("SELECT j FROM JobPosting j WHERE j.staff.id = :staffId")
    List<JobPosting> findByStaffId(@Param("staffId") Long staffId);
}