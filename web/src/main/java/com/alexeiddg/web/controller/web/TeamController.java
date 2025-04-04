package com.alexeiddg.web.controller.web;

import com.alexeiddg.web.model.Team;
import com.alexeiddg.web.service.interfaces.TeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/team")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    // Get Team by ID
    @GetMapping("/{teamId}")
    public ResponseEntity<Team> getTeamById(@PathVariable Long teamId) {
        Optional<Team> team = teamService.getTeamById(teamId);
        return team.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a New Team
    @PostMapping
    public ResponseEntity<Team> createTeam(@RequestBody Team team) {
        return ResponseEntity.ok(teamService.saveTeam(team));
    }

    // Delete Team by ID
    @DeleteMapping("/{teamId}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long teamId) {
        teamService.deleteTeam(teamId);
        return ResponseEntity.noContent().build();
    }

    // Assign a User to a Team
    @PostMapping("/{teamId}/assign-user/{userId}")
    public ResponseEntity<Team> assignUserToTeam(@PathVariable Long teamId, @PathVariable Long userId) {
        return ResponseEntity.ok(teamService.assignUserToTeam(teamId, userId));
    }

    // Remove a User from a Team
    @PostMapping("/{teamId}/remove-user/{userId}")
    public ResponseEntity<Team> removeUserFromTeam(@PathVariable Long teamId, @PathVariable Long userId) {
        return ResponseEntity.ok(teamService.removeUserFromTeam(teamId, userId));
    }

    // Assign a Team to a Project
    @PostMapping("/{teamId}/assign-project/{projectId}")
    public ResponseEntity<Team> assignTeamToProject(@PathVariable Long teamId, @PathVariable Long projectId) {
        return ResponseEntity.ok(teamService.assignTeamToProject(teamId, projectId));
    }

    // Get All Teams
    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    // Get Teams by Project ID
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Team>> getTeamsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(teamService.getTeamsByProject(projectId));
    }

    // Get Total Users in a Team
    @GetMapping("/{teamId}/count-users")
    public ResponseEntity<Integer> countUsersInTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(teamService.countUsersInTeam(teamId));
    }

    // Get Total Tasks Assigned to a Team
    @GetMapping("/{teamId}/count-tasks")
    public ResponseEntity<Integer> countTasksAssignedToTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(teamService.countTasksAssignedToTeam(teamId));
    }
}