package com.alexeiddg.web.service;

import lombok.RequiredArgsConstructor;
import model.Project;
import org.springframework.stereotype.Service;
import repository.ProjectRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    // Create
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    // Update
    public Project updateProject(Project project) {
        return projectRepository.save(project);
    }

    // Delete
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    // Get by Id
    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElse(null);
    }

    // Get project by TeamId
    public Project getProjectByTeamId(Long teamId) {
        return projectRepository.findByTeamsId(teamId).orElse(null);
    }

    // Get project manager
    public List<Project> getProjectByManagerId(Long managerId) {
        return projectRepository.findAllByManagerId(managerId);
    }

    // Get project by developerId
    public List<Project> getProjectsByDeveloperId(Long developerId) {
        return projectRepository.findAllByDeveloperId(developerId);
    }
}
