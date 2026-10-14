package com.careerlink.backend.controller;

import com.careerlink.backend.entity.Interview;
import com.careerlink.backend.entity.JobSeeker;
import com.careerlink.backend.entity.Staff;
import com.careerlink.backend.repository.JobSeekerRepository;
import com.careerlink.backend.repository.StaffRepository;
import com.careerlink.backend.service.InterviewService;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;
    private final JobSeekerRepository jobSeekerRepository;
    private final StaffRepository staffRepository;

    public InterviewController(InterviewService interviewService, JobSeekerRepository jobSeekerRepository,
                                StaffRepository staffRepository) {
        this.interviewService = interviewService;
        this.jobSeekerRepository = jobSeekerRepository;
        this.staffRepository = staffRepository;
    }

    // FR-18 - body: dateTime (yyyy-MM-ddTHH:mm), mode (ONLINE | IN_PERSON | PHONE)
    @PostMapping
    public Interview schedule(@RequestParam Long jobSeekerId, @RequestParam Long staffId,
                               @RequestBody Map<String, String> body) {
        JobSeeker jobSeeker = jobSeekerRepository.findById(jobSeekerId)
                .orElseThrow(() -> new IllegalArgumentException("Job seeker not found: " + jobSeekerId));
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found: " + staffId));
        return interviewService.schedule(jobSeeker, staff,
                LocalDateTime.parse(body.get("dateTime")), body.get("mode"));
    }

    // FR-20
    @PutMapping("/{interviewId}/reschedule")
    public Interview reschedule(@PathVariable Long interviewId, @RequestBody Map<String, String> body) {
        return interviewService.reschedule(interviewId, LocalDateTime.parse(body.get("dateTime")));
    }

    // edit date/time and/or mode - keys are optional
    @PutMapping("/{interviewId}")
    public Interview update(@PathVariable Long interviewId, @RequestBody Map<String, String> body) {
        String dateTime = body.get("dateTime");
        return interviewService.update(interviewId,
                dateTime != null ? LocalDateTime.parse(dateTime) : null, body.get("mode"));
    }

    @PutMapping("/{interviewId}/complete")
    public Interview complete(@PathVariable Long interviewId) {
        return interviewService.complete(interviewId);
    }

    @PutMapping("/{interviewId}/cancel")
    public Interview cancel(@PathVariable Long interviewId) {
        return interviewService.cancel(interviewId);
    }

    @GetMapping("/staff/{staffId}")
    public List<Interview> byStaff(@PathVariable Long staffId) {
        return interviewService.getByStaff(staffId);
    }

    @GetMapping("/{interviewId}")
    public Interview get(@PathVariable Long interviewId) {
        return interviewService.getById(interviewId);
    }

    // the candidate's own interview list
    @GetMapping("/job-seeker/{jobSeekerId}")
    public List<Interview> byJobSeeker(@PathVariable Long jobSeekerId) {
        return interviewService.getByJobSeeker(jobSeekerId);
    }

    @DeleteMapping("/{interviewId}")
    public Map<String, String> delete(@PathVariable Long interviewId) {
        interviewService.delete(interviewId);
        return Map.of("message", "Interview " + interviewId + " deleted.");
    }
}
