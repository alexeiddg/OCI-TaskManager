package DTO.domian.mappers;

import DTO.domian.ProjectDto;
import DTO.helpers.SprintSummaryDto;
import model.Project;
import model.Sprint;

import java.util.List;
import java.util.stream.Collectors;

public class ProjectMapper {

    public static ProjectDto toDto(Project project, boolean isFavorite) {
        return new ProjectDto(
                project.getId(),
                project.getProjectName(),
                project.getProjectDescription(),
                project.getProgress(),
                isFavorite,
                project.getManager().getId(),
                project.getManager().getName(),
                project.getTeam().getId(),
                project.getTeam().getTeamName(),
                project.getSprints() != null
                        ? project.getSprints().stream().map(ProjectMapper::toSprintSummary).collect(Collectors.toList())
                        : List.of(),
                project.getIsActive(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }

    private static SprintSummaryDto toSprintSummary(Sprint sprint) {
        return new SprintSummaryDto(sprint.getId(), sprint.getSprintName());
    }
}