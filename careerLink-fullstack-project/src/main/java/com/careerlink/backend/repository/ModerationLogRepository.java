package com.careerlink.backend.repository;

import com.careerlink.backend.entity.ModerationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ModerationLogRepository extends JpaRepository<ModerationLog, Long> {
    List<ModerationLog> findByJobPosting_JobId(Long jobId);
    List<ModerationLog> findByAdmin_UserId(Long adminId);
}
