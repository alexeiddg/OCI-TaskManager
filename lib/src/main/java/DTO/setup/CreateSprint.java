package DTO.setup;

import enums.SprintStatus;

import java.time.LocalDateTime;

public record CreateSprint(
        String sprintName,
        Long projectId,
        String sprintDescription,
        LocalDateTime startDate,
        LocalDateTime endDate,
        SprintStatus status,
        Boolean isActive
) { }
