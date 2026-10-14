package com.careerlink.backend.repository;

import com.careerlink.backend.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByJobSeeker_UserId(Long jobSeekerId);
    Optional<Bookmark> findByJobSeeker_UserIdAndJobPosting_JobId(Long jobSeekerId, Long jobId);
}
