package DTO.setup;

import enums.TaskPriority;
import enums.TaskStatus;
import enums.TaskType;

import java.time.LocalDateTime;

public record TaskUpdateRequest(
        Long id,
        String taskName,
        String taskDescription,
        TaskPriority taskPriority,
        TaskStatus taskStatus,
        TaskType taskType,
        int storyPoints,
        LocalDateTime dueDate,
        Long sprintId,
        Long assignedTo,
        Boolean blocked,
        Boolean isActive,
        boolean isFavorite,
        Long changedBy
) {
}
