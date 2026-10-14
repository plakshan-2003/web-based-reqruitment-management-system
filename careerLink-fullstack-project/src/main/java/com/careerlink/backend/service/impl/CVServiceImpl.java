package com.careerlink.backend.service.impl;

import com.careerlink.backend.exception.ResourceNotFoundException;
import com.careerlink.backend.entity.CV;
import com.careerlink.backend.entity.JobSeeker;
import com.careerlink.backend.repository.CVRepository;
import com.careerlink.backend.service.CVService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CVServiceImpl implements CVService {

    private final CVRepository cvRepository;

    public CVServiceImpl(CVRepository cvRepository) {
        this.cvRepository = cvRepository;
    }

    @Override
    public CV upload(JobSeeker jobSeeker, String fileUrl, String fileFormat) {
        return cvRepository.save(new CV(jobSeeker, fileUrl, fileFormat));
    }

    @Override
    public CV update(Long cvId, String newFileUrl, String newFileFormat) {
        CV cv = cvRepository.findById(cvId)
                .orElseThrow(() -> new ResourceNotFoundException("CV not found: " + cvId));
        cv.setFileUrl(newFileUrl);
        cv.setFileFormat(newFileFormat);
        return cvRepository.save(cv);
    }

    @Override
    public CV getById(Long cvId) {
        return cvRepository.findById(cvId)
                .orElseThrow(() -> new ResourceNotFoundException("CV not found: " + cvId));
    }

    @Override
    public void delete(Long cvId) {
        cvRepository.delete(getById(cvId));
    }

    @Override
    public List<CV> getByJobSeeker(Long jobSeekerId) {
        return cvRepository.findByJobSeeker_UserId(jobSeekerId);
    }
}
