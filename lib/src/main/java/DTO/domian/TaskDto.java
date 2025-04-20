package DTO.domian;

import enums.TaskPriority;
import enums.TaskStatus;
import enums.TaskType;

import java.time.LocalDateTime;

public record TaskDto(
        Long id,
        Long sprintId,
        String sprintName,
        String taskName,
        String taskDescription,
        TaskPriority priority,
        TaskStatus status,
        TaskType type,
        int storyPoints,
        LocalDateTime dueDate,
        LocalDateTime completedAt,
        Long createdById,
        String createdByUsername,
        String assignedToUsername,
        boolean blocked,
        Boolean isActive,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Boolean completed,
        Boolean favorite
) {}
