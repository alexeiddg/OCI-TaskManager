package DTO.helpers.mappers;

import DTO.helpers.SprintCardDto;
import DTO.helpers.SprintCardTaskDto;
import model.Sprint;
import model.Task;

import java.util.stream.Collectors;

public class SprintCardMapper {

    public static SprintCardDto toDto(Sprint sprint) {
        return new SprintCardDto(
                sprint.getId(),
                sprint.getSprintName(),
                sprint.getSprintDescription(),
                sprint.getProject().getId(),
                sprint.getStartDate(),
                sprint.getEndDate(),
                sprint.getStatus(),
                sprint.getCompletionRate(),
                sprint.getTasks().stream()
                        .map(SprintCardMapper::mapTask)
                        .collect(Collectors.toList())
        );
    }

    private static SprintCardTaskDto mapTask(Task task) {
        return new SprintCardTaskDto(
                task.getId(),
                task.getTaskName(),
                task.getAssignedTo() != null ? task.getAssignedTo().getName() : "Unassigned",
                task.isCompleted(),
                task.getPriority(),
                task.getStoryPoints()
        );
    }
}