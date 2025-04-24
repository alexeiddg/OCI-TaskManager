package DTO.domian.kpi.mappers;

import DTO.domian.kpi.SprintWithDepsDto;
import DTO.domian.kpi.SprintWithDepsDto.ProjectDto;
import DTO.domian.kpi.SprintWithDepsDto.TeamMemberDto;
import DTO.domian.kpi.SprintWithDepsDto.TaskDto;
import DTO.domian.kpi.SprintWithDepsDto.TaskDto.AppUserDto;
import model.Sprint;
import model.Task;
import model.AppUser;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.stream.Collectors;

public class SprintWithDepsMapper {

    public static SprintWithDepsDto toDto(Sprint sprint) {
        // project
        var proj = sprint.getProject();
        ProjectDto projectDto = new ProjectDto(
                proj.getId(),
                proj.getProjectName(),
                proj.getProjectDescription()
        );

        // team members
        var members = proj.getTeam().getMembers()
                .stream()
                .map(SprintWithDepsMapper::toTeamMember)
                .collect(Collectors.collectingAndThen(
                        Collectors.toCollection(LinkedHashSet::new),
                        ArrayList::new
                ));

        // tasks
        var tasks = sprint.getTasks()
                .stream()
                .filter(Task::getIsActive)
                .map(SprintWithDepsMapper::toTaskDto)
                .collect(Collectors.toList());

        return new SprintWithDepsDto(
                sprint.getId(),
                sprint.getSprintName(),
                sprint.getSprintDescription(),
                sprint.getStartDate(),
                sprint.getEndDate(),
                sprint.getStatus(),
                projectDto,
                members,
                tasks
        );
    }

    private static TeamMemberDto toTeamMember(AppUser u) {
        return new TeamMemberDto(
                u.getId(),
                u.getName(),
                u.getUsername(),
                u.getRole()
        );
    }

    private static TaskDto toTaskDto(Task t) {
        AppUserDto assigneeDto = t.getAssignedTo() != null
                ? new AppUserDto(
                t.getAssignedTo().getId(),
                t.getAssignedTo().getName(),
                t.getAssignedTo().getUsername()
        )
                : null;

        return new TaskDto(
                t.getId(),
                t.getTaskName(),
                t.getType(),
                t.getStatus(),
                t.getPriority(),
                t.getStoryPoints(),
                t.getDueDate(),
                t.getCompletedAt(),
                t.isBlocked(),
                assigneeDto,
                t.getCreatedAt()
        );
    }
}
