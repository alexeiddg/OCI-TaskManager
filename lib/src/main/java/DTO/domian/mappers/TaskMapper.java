package DTO.domian.mappers;

import DTO.domian.TaskDto;
import model.Task;

public class TaskMapper {

    public static TaskDto toDto(Task task) {
        return new TaskDto(
                task.getId(),
                task.getTaskName(),
                task.getTaskDescription(),
                task.getPriority(),
                task.getStatus(),
                task.getType(),
                task.getStoryPoints(),
                task.getDueDate(),
                task.getCompletedAt(),
                task.getSprint().getId(),
                task.getCreatedBy() != null ? task.getCreatedBy().getId() : null,
                task.getAssignedTo() != null ? task.getAssignedTo().getId() : null,
                task.isBlocked(),
                task.getIsActive(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}