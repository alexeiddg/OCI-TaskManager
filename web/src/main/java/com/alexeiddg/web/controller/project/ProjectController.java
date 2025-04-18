package com.alexeiddg.web.controller.project;

import com.alexeiddg.web.service.ProjectService;
import model.Project;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
