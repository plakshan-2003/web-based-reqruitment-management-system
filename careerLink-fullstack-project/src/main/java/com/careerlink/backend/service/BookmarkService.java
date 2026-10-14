package com.careerlink.backend.service;

import com.careerlink.backend.entity.Bookmark;
import com.careerlink.backend.entity.JobPosting;
import com.careerlink.backend.entity.JobSeeker;
import java.util.List;

public interface BookmarkService {

    Bookmark save(JobSeeker jobSeeker, JobPosting jobPosting);

    void remove(Long jobSeekerId, Long jobId);

    List<Bookmark> getByJobSeeker(Long jobSeekerId);
}
