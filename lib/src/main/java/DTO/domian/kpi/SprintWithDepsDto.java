package DTO.domian.kpi;

import enums.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO to carry all necessary sprint, project, task and team member data
 * for the frontend analytics dashboard.
 */
public record SprintWithDepsDto(
        Long id,
        String sprintName,
        String sprintDescription,
        LocalDateTime startDate,
        LocalDateTime endDate,
        SprintStatus status,
        ProjectDto project,
        List<TeamMemberDto> teamMembers,
        List<TaskDto> tasks
) {

    public record ProjectDto(
            Long id,
            String projectName,
            String projectDescription
    ) {}

    public record TeamMemberDto(
            Long id,
            String name,
            String username,
            UserRole role
    ) {}

    public record TaskDto(
            Long id,
            String taskName,
            TaskType type,
            TaskStatus status,
            TaskPriority priority,
            int storyPoints,
            LocalDateTime dueDate,
            LocalDateTime completedAt,
            boolean blocked,
            AppUserDto assignee,
            LocalDateTime createdAt
    ) {
        public record AppUserDto(
                Long id,
                String name,
                String username
        ) {}
    }
}
