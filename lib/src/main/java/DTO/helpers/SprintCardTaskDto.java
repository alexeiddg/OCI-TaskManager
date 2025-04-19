package DTO.helpers;

import enums.TaskPriority;

public record SprintCardTaskDto(
        Long id,
        String name,
        String assignee,
        boolean completed,
        TaskPriority priority,
        int estimate
) {}
