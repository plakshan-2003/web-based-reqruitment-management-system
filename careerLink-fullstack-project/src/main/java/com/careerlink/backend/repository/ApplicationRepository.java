package com.careerlink.backend.repository;

import com.careerlink.backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJobSeeker_UserId(Long jobSeekerId);
    List<Application> findByJobPosting_JobId(Long jobId);
}
