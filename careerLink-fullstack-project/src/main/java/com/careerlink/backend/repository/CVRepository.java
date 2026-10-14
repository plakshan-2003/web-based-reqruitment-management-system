package com.careerlink.backend.repository;

import com.careerlink.backend.entity.CV;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CVRepository extends JpaRepository<CV, Long> {
    List<CV> findByJobSeeker_UserId(Long jobSeekerId);
}
