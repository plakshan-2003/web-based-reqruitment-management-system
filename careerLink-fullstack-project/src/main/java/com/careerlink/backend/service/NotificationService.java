package com.careerlink.backend.service;

import com.careerlink.backend.entity.Admin;
import com.careerlink.backend.entity.Notification;
import com.careerlink.backend.entity.Staff;
import com.careerlink.backend.entity.User;
import com.careerlink.backend.entity.enums.NotificationType;
import java.time.LocalDate;
import java.util.List;

public interface NotificationService {

    // Accepts the abstract User type - works identically whether the
    // recipient underneath is a JobSeeker, Staff or Admin.
    Notification send(User recipient, String message, NotificationType type);

    // Admin asks staff to create a job posting: title, salary range and deadline
    // are validated and written into the notification text.
    List<Notification> sendJobPostingRequest(Admin admin, List<Staff> recipients, String jobTitle,
                                             double salaryMin, double salaryMax, LocalDate deadline, String notes);

    Notification getById(Long notificationId);

    List<Notification> getForUser(Long userId);

    List<Notification> getUnreadForUser(Long userId);

    void markAsRead(Long notificationId);

    void markAllAsRead(Long userId);

    void delete(Long notificationId);
}
