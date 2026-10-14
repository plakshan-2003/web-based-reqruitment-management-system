package com.careerlink.backend.repository;

import com.careerlink.backend.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByStaff_UserId(Long staffId);
    List<Interview> findByJobSeeker_UserId(Long jobSeekerId);
}
