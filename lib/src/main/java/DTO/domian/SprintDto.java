package DTO.domian;

import java.time.LocalDateTime;

public record SprintDto(
        Long id,
        String sprintName,
        LocalDateTime startDate,
        LocalDateTime endDate
) {}

