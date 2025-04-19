package DTO.domian;


import DTO.helpers.SprintSummaryDto;

import java.time.LocalDateTime;
import java.util.List;

public record ProjectDto(
        Long id,
        String projectName,
        String projectDescription,
        float progress,
        boolean favorite,
        Long managerId,
        String managerName,
        Long teamId,
        String teamName,
        List<SprintSummaryDto> sprints,
        Boolean isActive,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
