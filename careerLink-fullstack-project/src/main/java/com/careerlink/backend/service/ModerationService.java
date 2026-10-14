package com.careerlink.backend.service;

import com.careerlink.backend.entity.Admin;
import com.careerlink.backend.entity.JobPosting;
import com.careerlink.backend.entity.ModerationLog;
import java.util.List;

public interface ModerationService {

    ModerationLog approve(Admin admin, JobPosting jobPosting, String comments);

    ModerationLog reject(Admin admin, JobPosting jobPosting, String comments);

    List<ModerationLog> getHistoryForJob(Long jobId);

    List<ModerationLog> getAll();

    List<ModerationLog> getByAdmin(Long adminId);

    ModerationLog getById(Long logId);

    ModerationLog updateComments(Long logId, String comments);

    void delete(Long logId);
}
