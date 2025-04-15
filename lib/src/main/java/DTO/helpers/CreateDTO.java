package DTO.helpers;

import lombok.Getter;
import lombok.Setter;
import model.Project;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class CreateDTO {
    // team
    private String teamName;
    private long managerId;
    private Project project;
    private List<Long> membersIds;

    // project
    private String projectName;
    private String projectDescription;
    private List<Long> teamIds;
    private List<Long> sprintsIds;

    // sprint
    private String sprintName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Long projectId;

    // task
}
