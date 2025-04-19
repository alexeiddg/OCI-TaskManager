package DTO.helpers;

import enums.SprintStatus;

import java.time.LocalDateTime;
import java.util.List;

public record SprintCardDto(
        Long id,
        String name,
        String goal,
        Long projectId,
        LocalDateTime startDate,
        LocalDateTime endDate,
        SprintStatus status,
        float progress,
        List<SprintCardTaskDto> tasks
) {}
