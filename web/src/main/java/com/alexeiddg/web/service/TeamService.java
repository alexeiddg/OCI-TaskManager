package com.alexeiddg.web.service;

import model.AppUser;
import model.Team;
import org.springframework.stereotype.Service;
import repository.AppUserRepository;
import repository.TeamRepository;

import java.util.List;
import java.util.Optional;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final AppUserRepository appUserRepository;

    public TeamService(TeamRepository teamRepository, AppUserRepository appUserRepository) {
        this.teamRepository = teamRepository;
        this.appUserRepository = appUserRepository;
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

    // Create solo team
    public Team createSoloTeam(Long userId) {
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = new Team();
        team.setTeamName(user.getUsername() + "-team");
        team.setManager(user);
        team.setMembers(List.of(user));
        team.setIsActive(true);

        return teamRepository.save(team);
    }
}
