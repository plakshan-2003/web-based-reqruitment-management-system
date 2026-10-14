package com.careerlink.backend.repository;

import com.careerlink.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUser_UserIdOrderBySentDateDesc(Long userId);
    List<Notification> findByUser_UserIdAndReadStatusFalse(Long userId);
}
