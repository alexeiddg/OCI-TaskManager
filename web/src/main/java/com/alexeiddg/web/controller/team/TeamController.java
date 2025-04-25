package com.alexeiddg.web.controller.team;

import DTO.domian.AppUserDto;

import com.alexeiddg.web.service.AppUserService;
import com.alexeiddg.web.service.EmailService;
import com.alexeiddg.web.service.TeamService;

import model.AppUser;
import model.Project;
import model.Team;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v2/team")
public class TeamController {

    private final TeamService teamService;
    private final AppUserService appUserService;
    private final EmailService emailService;

public TeamController(TeamService teamService, AppUserService appUserService, EmailService emailService) {
    this.teamService = teamService;
    this.appUserService = appUserService;
    this.emailService = emailService;
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

    @PostMapping("/{teamId}/add-member")
    public ResponseEntity<String> addMemberToTeam(
            @PathVariable("teamId") Long teamId,
            @RequestParam("userId") Long userId) {
        boolean success = teamService.addUserToTeam(teamId, userId);
        if (success) {
            return ResponseEntity.ok("User added to team successfully.");
        } else {
            return ResponseEntity.badRequest().body("Failed to add user to team.");
        }
    }


    @PostMapping("/{teamId}/invite")
    public ResponseEntity<Map<String, String>> inviteToTeam(
        @PathVariable("teamId") Long teamId,
        @RequestParam("email") String email) {

        Optional<AppUser> userOptional = appUserService.getUserByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }

        // Generate link (could use a token or just the teamId for now)
        // TODO: Change hardcoded frontend url
        String inviteLink = "https://pms.pathscreative/email/accept-invite?userId=" + userOptional.get().getId()
                        + "&teamId=" + teamId;

        emailService.sendInvitation(email, inviteLink);
        return ResponseEntity.ok(Map.of("message", "Invitation sent to " + email));

    }

    @PostMapping("/accept-invite")
    public ResponseEntity<Map<String,String>> acceptInvite(
        @RequestParam("userId") Long userId,
        @RequestParam("teamId") Long teamId) {

        boolean added = teamService.addUserToTeam(teamId, userId);

        if (added)
            return ResponseEntity.ok(Map.of("message", "User added to team."));
        else
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to add user."));

    }
}
