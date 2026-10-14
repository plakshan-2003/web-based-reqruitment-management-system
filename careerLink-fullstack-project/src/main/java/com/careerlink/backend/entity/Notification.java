package com.careerlink.backend.entity;

import com.careerlink.backend.entity.enums.NotificationType;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Notification - the "Receives" relationship targets the abstract User
 * type directly (not JobSeeker/Staff/Admin individually). This is a
 * deliberate polymorphism example: one Notification table serves every
 * concrete role, and NotificationService below can hand a notification to
 * *any* User subtype without knowing which one it is.
 */
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // polymorphic reference: JobSeeker, Staff or Admin

    @Column(length = 1000)
    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Column(name = "sent_date")
    private LocalDateTime sentDate;

    @Column(name = "read_status")
    private boolean readStatus;

    protected Notification() {
        this.sentDate = LocalDateTime.now();
        this.readStatus = false;
    }

    public Notification(User user, String message, NotificationType type) {
        this();
        this.user = user;
        this.message = message;
        this.type = type;
    }

    public Long getNotificationId() {
        return notificationId;
    }

    public User getUser() {
        return user;
    }

    public String getMessage() {
        return message;
    }

    public NotificationType getType() {
        return type;
    }

    public LocalDateTime getSentDate() {
        return sentDate;
    }

    public boolean isReadStatus() {
        return readStatus;
    }

    public void markAsRead() {
        this.readStatus = true;
    }
}
