package com.alexeiddg.web.service.interfaces;

import com.alexeiddg.web.model.AppUser;
import com.alexeiddg.web.model.Project;

import java.util.List;
import java.util.Optional;

public interface ProjectService {
    Optional<Project> getProjectById(Long projectId);
    Project saveProject(Project project);
    void deleteProject(Long projectId);

    // Project Management
    List<Project> getAllProjects();
    List<Project> getProjectsManagedByUser(Long managerId);
    List<Project> findByUser(AppUser user);
    Project assignManagerToProject(Long projectId, Long managerId);
}
