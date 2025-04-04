package com.alexeiddg.web.service.interfaces;

import com.alexeiddg.web.model.TaskAudit;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

public interface TaskAuditService {
    Optional<TaskAudit> getAuditEntryById(Long auditId);
    TaskAudit saveAuditEntry(TaskAudit taskAudit);
    void deleteAuditEntry(Long auditId);

    // Retrieving Task History
    List<TaskAudit> getAuditEntriesForTask(Long taskId);
    List<TaskAudit> getAuditEntriesByUser(Long userId);
    List<TaskAudit> getAuditEntriesByChangeType(String changeType);
    List<TaskAudit> getAuditEntriesByDateRange(OffsetDateTime startDate, OffsetDateTime endDate);

    // Generating Task Reports
    List<TaskAudit> getRecentChanges(int limit);
    long countChangesByTask(Long taskId);
    long countChangesByUser(Long userId);
}
