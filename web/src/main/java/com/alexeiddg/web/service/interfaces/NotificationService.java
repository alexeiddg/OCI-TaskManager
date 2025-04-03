package com.alexeiddg.web.service.interfaces;

import com.alexeiddg.web.model.Notification;

import java.util.List;
import java.util.Optional;

public interface NotificationService {
    Optional<Notification> getNotificationById(Long notificationId);
    Notification saveNotification(Notification notification);
    void deleteNotification(Long notificationId);

    // Fetch Notifications
    List<Notification> getNotificationsByUser(Long userId);
    List<Notification> getUnreadNotificationsByUser(Long userId);
    List<Notification> getNotificationsByTask(Long taskId);

    // Mark Notification as Read
    Notification markNotificationAsRead(Long notificationId);
}
