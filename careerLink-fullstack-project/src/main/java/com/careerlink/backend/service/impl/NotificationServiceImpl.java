package com.careerlink.backend.service.impl;

import com.careerlink.backend.exception.ResourceNotFoundException;
import com.careerlink.backend.entity.Admin;
import com.careerlink.backend.entity.Notification;
import com.careerlink.backend.entity.Staff;
import com.careerlink.backend.entity.User;
import com.careerlink.backend.entity.enums.NotificationType;
import com.careerlink.backend.repository.NotificationRepository;
import com.careerlink.backend.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public Notification send(User recipient, String message, NotificationType type) {
        // `recipient` is typed as User here (the abstract superclass), but
        // may physically be a JobSeeker, Staff or Admin - the caller of
        // send() never needs to know or care which. FR-23 (notifications to
        // any role) falls out naturally from this one polymorphic method.
        return notificationRepository.save(new Notification(recipient, message, type));
    }

    @Override
    @Transactional
    public List<Notification> sendJobPostingRequest(Admin admin, List<Staff> recipients, String jobTitle,
                                                    double salaryMin, double salaryMax, LocalDate deadline, String notes) {
        if (jobTitle == null || jobTitle.isBlank()) {
            throw new IllegalArgumentException("Job title is required.");
        }
        if (salaryMin <= 0 || salaryMax <= 0) {
            throw new IllegalArgumentException("Salary range must be positive numbers.");
        }
        if (salaryMin > salaryMax) {
            throw new IllegalArgumentException("Minimum salary cannot be greater than maximum salary.");
        }
        if (deadline == null) {
            throw new IllegalArgumentException("Application deadline is required.");
        }
        if (deadline.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Application deadline cannot be in the past.");
        }
        if (recipients == null || recipients.isEmpty()) {
            throw new IllegalArgumentException("There are no staff members to notify.");
        }

        String message = String.format(
                "Admin %s has requested a new job posting. Job title: \"%s\". Salary range: %,.0f - %,.0f. Application deadline: %s.",
                admin.getFullName(), jobTitle.trim(), salaryMin, salaryMax, deadline);
        if (notes != null && !notes.isBlank()) {
            message += " Notes: " + notes.trim();
        }

        List<Notification> sent = new java.util.ArrayList<>();
        for (Staff staff : recipients) {
            sent.add(notificationRepository.save(new Notification(staff, message, NotificationType.JOB_POSTING_REQUEST)));
        }
        return sent;
    }

    @Override
    public Notification getById(Long notificationId) {
        return notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + notificationId));
    }

    @Override
    public List<Notification> getForUser(Long userId) {
        return notificationRepository.findByUser_UserIdOrderBySentDateDesc(userId);
    }

    @Override
    public List<Notification> getUnreadForUser(Long userId) {
        return notificationRepository.findByUser_UserIdAndReadStatusFalse(userId);
    }

    @Override
    public void markAsRead(Long notificationId) {
        Notification notification = getById(notificationId);
        notification.markAsRead();
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUser_UserIdAndReadStatusFalse(userId);
        unread.forEach(Notification::markAsRead);
        notificationRepository.saveAll(unread);
    }

    @Override
    public void delete(Long notificationId) {
        notificationRepository.delete(getById(notificationId));
    }
}
