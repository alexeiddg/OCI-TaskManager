package DTO.domian.mappers;

import DTO.domian.TaskDto;
import model.Task;

public class TaskMapper {

    public static TaskDto toDto(Task task, Boolean isFavorite) {
        return new TaskDto(
                task.getId(),
                task.getSprint() != null ? task.getSprint().getId() : null,
                task.getSprint() != null ? task.getSprint().getSprintName() : null,
                task.getTaskName(),
                task.getTaskDescription(),
                task.getPriority(),
                task.getStatus(),
                task.getType(),
                task.getStoryPoints(),
                task.getDueDate(),
                task.getCompletedAt(),
                task.getCreatedBy() != null ? task.getCreatedBy().getId() : null,
                task.getAssignedTo() != null ? task.getAssignedTo().getUsername() : null,
                task.getAssignedTo() != null ? task.getAssignedTo().getUsername() : null,
                task.isBlocked(),
                task.getIsActive(),
                task.getCreatedAt(),
                task.getUpdatedAt(),
                task.isCompleted(),
                isFavorite
        );
    }
}