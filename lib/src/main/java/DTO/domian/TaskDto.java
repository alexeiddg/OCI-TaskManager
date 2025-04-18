package DTO.domian;

import enums.TaskPriority;
import enums.TaskStatus;
import enums.TaskType;

import java.time.LocalDateTime;

public record TaskDto(
        Long id,
        String taskName,
        String taskDescription,
        TaskPriority priority,
        TaskStatus status,
        TaskType type,
        int storyPoints,
        LocalDateTime dueDate,
        LocalDateTime completedAt,
        Long sprintId,
        Long createdById,
        Long assignedToId,
        boolean blocked,
        Boolean isActive,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
