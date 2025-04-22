package com.alexeiddg.telegram.service;

import enums.SprintStatus;
import enums.UserRole;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import model.Project;
import model.Sprint;
import org.springframework.stereotype.Service;
import repository.AppUserRepository;
import repository.ProjectRepository;
import repository.SprintRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SprintService {

    private final SprintRepository sprintRepository;
    private final ProjectRepository projectRepository;
    private final AppUserRepository appUserRepository;
    private final KpiSnapshotService kpiSnapshotService;

    public Sprint createSprint(Sprint sprint) {
        return sprintRepository.save(sprint);
    }

    public Sprint updateSprint(Sprint sprint) {
        return sprintRepository.save(sprint);
    }

    public void deleteSprint(Long sprintId) {
        sprintRepository.deleteById(sprintId);
    }

    public Optional<Sprint> getSprintById(Long id) {
        return sprintRepository.findById(id);
    }

    public List<Sprint> getAllSprints() {
        return sprintRepository.findAll();
    }

    public List<Sprint> getSprintsByProjectId(Long projectId) {
        return sprintRepository.findByProjectId(projectId);
    }

    // TODO retrieve only active sprints
    public List<Sprint> getSprintsForUser(Long userId) {
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Project> projects;

        if (user.getRole() == UserRole.MANAGER) {
            projects = projectRepository.findAllByManagerId(user.getId());
        } else if (user.getRole() == UserRole.DEVELOPER) {
            projects = projectRepository.findAllByDeveloperId(user.getId());
        } else {
            throw new IllegalArgumentException("User role not supported");
        }

        List<Long> projectIds = projects.stream()
                .map(Project::getId)
                .toList();

        if (projectIds.isEmpty()) return List.of();

        return sprintRepository.findByProjectIdIn(projectIds);
    }

    public void deactivateSprint(Long sprintId) {
        sprintRepository.findById(sprintId).ifPresent(sprint -> {
            sprint.setIsActive(false);
            sprintRepository.save(sprint);
        });
    }

    public void markSprintAsCompleted(Sprint sprint) {
        sprint.setStatus(SprintStatus.COMPLETED);
        sprintRepository.save(sprint);

        kpiSnapshotService.snapshotForSprint(sprint);
    }

    // find latest sprint
    public Optional<Sprint> findLatestSprintForTeam(Long teamId) {
        return sprintRepository.findLatestWithTasksByTeamId(teamId);
    }

    public Optional<Sprint> findLatestSprintWithAllRelations(Long teamId) {
        return sprintRepository.findLatestSprintWithAllRelations(teamId);
    }
}
