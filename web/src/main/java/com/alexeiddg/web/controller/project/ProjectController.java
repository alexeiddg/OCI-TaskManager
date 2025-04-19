package com.alexeiddg.web.controller.project;

import DTO.domian.ProjectDto;
import com.alexeiddg.web.service.ProjectService;
import model.Project;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v2/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return ResponseEntity.ok(projectService.createProject(project));
    }

    // Update Project
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable("id") Long id, @RequestBody Project project) {
        project.setId(id);
        return ResponseEntity.ok(projectService.updateProject(project));
    }

    // Delete Project
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable("id") Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable("id") Long id) {
        Project project = projectService.getProjectById(id);
        return project != null ? ResponseEntity.ok(project) : ResponseEntity.notFound().build();
    }

    @GetMapping("/by-team/{teamId}")
    public ResponseEntity<Project> getProjectByTeamId(@PathVariable("teamId") Long teamId) {
        Project project = projectService.getProjectByTeamId(teamId);
        return project != null ? ResponseEntity.ok(project) : ResponseEntity.notFound().build();
    }

    // Get Projects by Manager Id
    @GetMapping("/by-manager/{managerId}")
    public ResponseEntity<List<Project>> getProjectsByManagerId(@PathVariable("managerId") Long managerId) {
        return ResponseEntity.ok(projectService.getProjectByManagerId(managerId));
    }

    // Get Projects by Developer Id
    @GetMapping("/by-developer/{developerId}")
    public ResponseEntity<List<Project>> getProjectsByDeveloperId(@PathVariable("developerId") Long developerId) {
        return ResponseEntity.ok(projectService.getProjectsByDeveloperId(developerId));
    }

    // Get all projects by team id
    @GetMapping("/team/{teamId}/user/{userId}")
    public ResponseEntity<List<ProjectDto>> getProjectsByTeamAndUser(
            @PathVariable("teamId") Long teamId,
            @PathVariable("userId") Long userId
    ) {
        List<ProjectDto> projects = projectService.getProjectsByTeamId(teamId, userId);
        return ResponseEntity.ok(projects);
    }

    // toggle project a favorite
    @PostMapping("/{projectId}/favorite")
    public ResponseEntity<Map<String, Boolean>> toggleFavoriteProject(
            @PathVariable("projectId") Long projectId,
            @RequestParam("userId") Long userId
    ) {
        boolean isNowFavorite = projectService.toggleFavorite(projectId, userId);
        return ResponseEntity.ok(Map.of("favorite", isNowFavorite));
    }
}
