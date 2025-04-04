package com.alexeiddg.web.service;

import model.Project;
import model.Sprint;
import org.springframework.stereotype.Service;
import repository.ProjectRepository;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public void createProject(Project project) {
        projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElse(null);
    }

    public void updateProject(Project project) {
        projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public List<Project> getProjectsByManagerId(Long managerId) {
        return projectRepository.findAllByManagerId(managerId);
    }

    public List<Project> getProjectsByDeveloperId(Long developerId) {
        return projectRepository.findAllByDeveloperId(developerId);
    }

    public List<Sprint> getSprintsByProjectId(Long projectId) {
        return projectRepository.findById(projectId)
                .map(Project::getSprints)
                .orElse(List.of());
    }

}
