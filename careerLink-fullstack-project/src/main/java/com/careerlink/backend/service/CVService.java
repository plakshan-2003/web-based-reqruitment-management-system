package com.careerlink.backend.service;

import com.careerlink.backend.entity.CV;
import com.careerlink.backend.entity.JobSeeker;
import java.util.List;

public interface CVService {

    CV upload(JobSeeker jobSeeker, String fileUrl, String fileFormat);

    CV update(Long cvId, String newFileUrl, String newFileFormat);

    CV getById(Long cvId);

    List<CV> getByJobSeeker(Long jobSeekerId);

    void delete(Long cvId);
}
