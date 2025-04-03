package com.alexeiddg.web.service.classes;

import com.alexeiddg.web.model.TaskAudit;
import com.alexeiddg.web.repository.TaskAuditRepository;
import com.alexeiddg.web.service.interfaces.TaskAuditService;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskAuditServiceImpl implements TaskAuditService {
    private final TaskAuditRepository taskAuditRepository;

    public TaskAuditServiceImpl(TaskAuditRepository taskAuditRepository) {
        this.taskAuditRepository = taskAuditRepository;
    }

    @Override
    public Optional<TaskAudit> getAuditEntryById(Long auditId) {
        return taskAuditRepository.findById(auditId);
    }

    @Override
    public TaskAudit saveAuditEntry(TaskAudit taskAudit) {
        return taskAuditRepository.save(taskAudit);
    }

    @Override
    public void deleteAuditEntry(Long auditId) {
        taskAuditRepository.deleteById(auditId);
    }

    // Retrieving Task History
    @Override
    public List<TaskAudit> getAuditEntriesForTask(Long taskId) {
        return taskAuditRepository.findByTask_TaskId(taskId);
    }

    @Override
    public List<TaskAudit> getAuditEntriesByUser(Long userId) {
        return taskAuditRepository.findByChangedBy_UserId(userId);
    }

    @Override
    public List<TaskAudit> getAuditEntriesByChangeType(String changeType) {
        return taskAuditRepository.findByChangeType(changeType);
    }

    @Override
    public List<TaskAudit> getAuditEntriesByDateRange(OffsetDateTime startDate, OffsetDateTime endDate) {
        return taskAuditRepository.findByDateRange(startDate, endDate);
    }

    // Generating Task Reports
    @Override
    public List<TaskAudit> getRecentChanges(int limit) {
        return taskAuditRepository.findRecentChangesLimited(limit);
    }

    @Override
    public long countChangesByTask(Long taskId) {
        return taskAuditRepository.countChangesByTask(taskId);
    }

    @Override
    public long countChangesByUser(Long userId) {
        return taskAuditRepository.countChangesByUser(userId);
    }
}