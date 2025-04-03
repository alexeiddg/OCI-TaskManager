package com.alexeiddg.web.service.interfaces;

import com.alexeiddg.web.model.Team;

import java.util.List;
import java.util.Optional;

public interface TeamService {
    Optional<Team> getTeamById(Long teamId);
    Team saveTeam(Team team);
    void deleteTeam(Long teamId);

    // Team Assignments
    Team assignUserToTeam(Long teamId, Long userId);
    Team removeUserFromTeam(Long teamId, Long userId);
    Team assignTeamToProject(Long teamId, Long projectId);

    // Retrieving Teams
    List<Team> getAllTeams();
    List<Team> getTeamsByProject(Long projectId);

    // Metrics & Statistics
    int countUsersInTeam(Long teamId);
    int countTasksAssignedToTeam(Long teamId);

    List<Team> getTeamsByProjectId(Long projectId);
}
