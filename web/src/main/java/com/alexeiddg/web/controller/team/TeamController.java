package com.alexeiddg.web.controller.team;

import DTO.domian.AppUserDto;
import com.alexeiddg.web.service.TeamService;
import model.Project;
import model.Team;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v2/team")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    // Create Team
    @PostMapping
    public ResponseEntity<Team> createTeam(@RequestBody Team team) {
        Team saved = teamService.createTeam(team);
        return ResponseEntity.ok(saved);
    }

    // Update team
    @PutMapping("/{id}")
    public ResponseEntity<Team> updateTeam(@PathVariable("id") Long id, @RequestBody Team team) {
        team.setId(id);
        Team updated = teamService.updateTeam(team);
        return ResponseEntity.ok(updated);
    }

    // Delete team
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable("id") Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }

    // Get team by name
    @GetMapping("/name/{name}")
    public ResponseEntity<Team> getTeamByName(@PathVariable("name") String name) {
        return teamService.getTeamByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // get team by id
    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable("id") Long id) {
        return teamService.getTeamById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // get team by project id
    @GetMapping("/project/{projectId}")
    public ResponseEntity<Optional<Team>> getTeamsByProjectId(@PathVariable("projectId") Long projectId) {
        return ResponseEntity.ok(teamService.getTeamsByProjectId(projectId));
    }

    // Get team by manager id
    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<Team>> getTeamsByManagerId(@PathVariable("managerId") Long managerId) {
        return ResponseEntity.ok(teamService.getTeamsByManagerId(managerId));
    }

    // Get team by user id
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Team>> getTeamsByUserId(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(teamService.getTeamsByUserId(userId));
    }

    // Get members of a specific team
    @GetMapping("/{teamId}/members")
    public ResponseEntity<List<AppUserDto>> getTeamMembers(@PathVariable("teamId") Long teamId) {
        return ResponseEntity.ok(teamService.getTeamMembers(teamId));
    }

    // Create solo team
    @PostMapping("/create-solo")
    public ResponseEntity<Team> createSoloTeam(@RequestParam("userId") Long userId) {
        Team team = teamService.createSoloTeam(userId);
        return ResponseEntity.ok(team);
    }

    // Get team projects
    @GetMapping("/{id}/projects")
    public ResponseEntity<List<Project>> getTeamProjects(@PathVariable("id") Long id) {
        return ResponseEntity.ok(teamService.getTeamProjects(id));
    }
}
