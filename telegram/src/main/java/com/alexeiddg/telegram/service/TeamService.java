package com.alexeiddg.telegram.service;

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

    public Team createTeam(Team team) {
        return teamRepository.save(team);
    }

    public Team updateTeam(Team team) {
        return teamRepository.save(team);
    }

    public void deleteTeam(Long teamId) {
        teamRepository.deleteById(teamId);
    }

    public Team getTeam(Long teamId) {
        return teamRepository.findById(teamId).orElse(null);
    }

    public List<Team> getTeams() {
        return teamRepository.findAll();
    }

    public Optional<Team> getTeamsByProjectId(Long projectId) {
        return teamRepository.findTeamByProjectId(projectId);
    }

    public List<Team> getTeamsByManagerId(Long managerId) {
        return teamRepository.findByManagerId(managerId);
    }

    public List<Team> getTeamsByDeveloperId(Long developerId) {
        return teamRepository.findByMembersId(developerId);
    }
}
