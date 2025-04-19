package com.alexeiddg.web.service;

import DTO.domian.ProjectDto;
import DTO.domian.mappers.ProjectMapper;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import model.Project;
import model.ProjectFavorite;
import org.springframework.stereotype.Service;
import repository.AppUserRepository;
import repository.ProjectFavoriteRepository;
import repository.ProjectRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectFavoriteRepository projectFavoriteRepository;
    private final AppUserRepository appUserRepository;

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

    // Get all projects by team id
    public List<ProjectDto> getProjectsByTeamId(Long teamId, Long userId) {
        List<Project> projects = projectRepository.findAllByTeamId(teamId);

        return projects.stream()
                .map(project -> {
                    boolean isFavorite = projectFavoriteRepository.existsByProjectIdAndUserId(project.getId(), userId);
                    return ProjectMapper.toDto(project, isFavorite);
                })
                .collect(Collectors.toList());
    }


    public boolean toggleFavorite(Long projectId, Long userId) {
        boolean exists = projectFavoriteRepository.existsByProjectIdAndUserId(projectId, userId);

        if (exists) {
            ProjectFavorite existing = projectFavoriteRepository
                    .findAll()
                    .stream()
                    .filter(fav -> fav.getProject().getId().equals(projectId) && fav.getUser().getId().equals(userId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Favorite not found"));
            projectFavoriteRepository.delete(existing);
            return false;
        } else {
            Project project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            AppUser user = appUserRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            ProjectFavorite favorite = new ProjectFavorite();
            favorite.setProject(project);
            favorite.setUser(user);
            projectFavoriteRepository.save(favorite);
            return true;
        }
    }
}
