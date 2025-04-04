package com.alexeiddg.telegram.service;

import enums.UserRole;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import model.Project;
import model.Sprint;
import org.springframework.stereotype.Service;
import repository.AppUserRepository;
import repository.ProjectRepository;
import repository.SprintRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SprintService {

    private final SprintRepository sprintRepository;
    private final ProjectRepository projectRepository;
    private final AppUserRepository appUserRepository;

    public Sprint createSprint(Sprint sprint, Long projectId) {
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isEmpty()) {
            throw new IllegalArgumentException("Project not found with ID: " + projectId);
        }

        sprint.setProject(projectOpt.get());
        sprint.setCreatedAt(LocalDateTime.now());
        sprint.setActive(true);
        sprint.setCompletedTasks(0);
        sprint.setTotalTasks(0);
        sprint.setCompletionRate(0.0f);

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

    public List<Sprint> getSprintsForUser(Long userId) {
        AppUser user = appUserRepository.findById(userId).orElse(null);

        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        List<Project> projects;

        if (user.getRole().equals(UserRole.MANAGER)) {
            projects = projectRepository.findAllByManagerId(user.getId());
        } else if (user.getRole().equals(UserRole.DEVELOPER)) {
            projects = projectRepository.findAllByDeveloperId(user.getId());
        } else {
            throw new IllegalArgumentException("User role not supported");
        }

        List<Sprint> allSprints = new ArrayList<>();

        for (Project project : projects) {
            if (project.getSprints() != null) {
                allSprints.addAll(project.getSprints());
            }
        }

        return allSprints;
    }

    public void deactivateSprint(Long sprintId) {
        sprintRepository.findById(sprintId).ifPresent(sprint -> {
            sprint.setActive(false);
            sprintRepository.save(sprint);
        });
    }
}
