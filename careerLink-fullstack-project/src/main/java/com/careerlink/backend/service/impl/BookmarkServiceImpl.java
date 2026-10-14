package com.careerlink.backend.service.impl;

import com.careerlink.backend.entity.Bookmark;
import com.careerlink.backend.entity.JobPosting;
import com.careerlink.backend.entity.JobSeeker;
import com.careerlink.backend.repository.BookmarkRepository;
import com.careerlink.backend.service.BookmarkService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookmarkServiceImpl implements BookmarkService {

    private final BookmarkRepository bookmarkRepository;

    public BookmarkServiceImpl(BookmarkRepository bookmarkRepository) {
        this.bookmarkRepository = bookmarkRepository;
    }

    @Override
    public Bookmark save(JobSeeker jobSeeker, JobPosting jobPosting) {
        return bookmarkRepository.save(new Bookmark(jobSeeker, jobPosting));
    }

    @Override
    public void remove(Long jobSeekerId, Long jobId) {
        bookmarkRepository.findByJobSeeker_UserIdAndJobPosting_JobId(jobSeekerId, jobId)
                .ifPresent(bookmarkRepository::delete);
    }

    @Override
    public List<Bookmark> getByJobSeeker(Long jobSeekerId) {
        return bookmarkRepository.findByJobSeeker_UserId(jobSeekerId);
    }
}
