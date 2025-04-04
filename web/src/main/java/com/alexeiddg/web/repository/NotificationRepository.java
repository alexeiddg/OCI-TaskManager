package com.alexeiddg.web.repository;

import com.alexeiddg.web.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import jakarta.transaction.Transactional;

@Repository
@Transactional
@EnableTransactionManagement
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // impl
}
