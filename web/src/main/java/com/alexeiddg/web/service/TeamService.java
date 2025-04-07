package com.alexeiddg.web.service;

import model.Team;
import org.springframework.stereotype.Service;
import repository.TeamRepository;

import java.util.List;
import java.util.Optional;

@Service
public class TeamService {

    private final TeamRepository teamRepository;

    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    // Create Team
    public Team createTeam(Team team) {
        return teamRepository.save(team);
    }

    // Update team
    public Team updateTeam(Team team) {
        return teamRepository.save(team);
    }

    // Delete team
    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }

    // Get team by name
    public Optional<Team> getTeamByName(String teamName) {
        return teamRepository.findByTeamName(teamName);
    }

    // get team by id
    public Optional<Team> getTeamById(Long id) {
        return teamRepository.findById(id);
    }

    // get team by project id
    public List<Team> getTeamsByProjectId(Long projectId) {
        return teamRepository.findByProjectId(projectId);
    }

    // Get team by manager id
    public List<Team> getTeamsByManagerId(Long managerId) {
        return teamRepository.findByManagerId(managerId);
    }

    // Get team by user id
    public List<Team> getTeamsByUserId(Long userId) {
        return teamRepository.findByMembersId(userId);
    }
}
