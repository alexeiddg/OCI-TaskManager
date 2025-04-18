package DTO.setup;

import enums.TaskPriority;
import enums.TaskStatus;
import enums.TaskType;

import java.time.LocalDateTime;

public record TaskCreationRequest(
        String taskName,
        String taskDescription,
        TaskPriority taskPriority,
        TaskStatus taskStatus,
        TaskType taskType,
        int storyPoints,
        LocalDateTime dueDate,
        Long sprintId,
        Long createdBy,
        Long assignedTo,
        boolean isFavorite
) {}
