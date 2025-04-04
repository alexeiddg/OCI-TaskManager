package com.alexeiddg.web.repository;

import com.alexeiddg.web.model.TaskAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.util.List;

@Repository
@Transactional
@EnableTransactionManagement
public interface TaskAuditRepository extends JpaRepository<TaskAudit,Long> {
    List<TaskAudit> findByTask_TaskId(Long taskId);
    List<TaskAudit> findByChangedBy_UserId(Long userId);
    List<TaskAudit> findByChangeType(String changeType);

    @Query("SELECT t FROM TaskAudit t WHERE t.changedAt BETWEEN :startDate AND :endDate")
    List<TaskAudit> findByDateRange(OffsetDateTime startDate, OffsetDateTime endDate);

    // Generating Task Reports
    @Query("SELECT t FROM TaskAudit t ORDER BY t.changedAt DESC")
    List<TaskAudit> findRecentChangesLimited(int limit);

    @Query("SELECT COUNT(t) FROM TaskAudit t WHERE t.task.taskId = :taskId")
    long countChangesByTask(Long taskId);

    @Query("SELECT COUNT(t) FROM TaskAudit t WHERE t.changedBy.userId = :userId")
    long countChangesByUser(Long userId);
}

