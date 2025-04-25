package com.alexeiddg.web.service;

import DTO.domian.AppUserDto;
import DTO.setup.TeamCreationRequest;
import model.AppUser;
import model.Project;
import model.Sprint;
import model.Team;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import repository.AppUserRepository;
import repository.ProjectRepository;
import repository.SprintRepository;
import repository.TeamRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final AppUserRepository appUserRepository;
    private final ProjectRepository projectRepository;
    private final SprintRepository sprintRepository;

    public TeamService(
            TeamRepository teamRepository,
            AppUserRepository appUserRepository,
            ProjectRepository projectRepository,
            SprintRepository sprintRepository
    ) {
        this.teamRepository = teamRepository;
        this.appUserRepository = appUserRepository;
        this.projectRepository = projectRepository;
        this.sprintRepository = sprintRepository;
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
    public Optional<Team> getTeamsByProjectId(Long projectId) {
        return teamRepository.findTeamByProjectId(projectId);
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

    @Transactional
    public void createTeamWithProjectAndSprint(TeamCreationRequest request, String username) {
        AppUser manager = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Create Team
        Team team = new Team();
        team.setTeamName(request.getTeamName());
        team.setManager(manager);
        team.setMembers(new ArrayList<>(List.of(manager)));
        team = teamRepository.save(team);

        // 2. Add team to manager
        manager.setTeam(team);
        appUserRepository.save(manager);

        // 3. Create Project
        Project project = new Project();
        project.setProjectName(request.getProject().getName());
        project.setProjectDescription(request.getProject().getDescription());
        project.setManager(manager);
        project.setTeam(team);
        project = projectRepository.save(project);

        // 3. Add project to team
        List<Project> existingProjects = team.getProjects() != null ? team.getProjects() : new ArrayList<>();
        existingProjects.add(project);
        team.setProjects(existingProjects);
        teamRepository.save(team);

        // 4. Create Sprint
        Sprint sprint = new Sprint();
        sprint.setSprintName(request.getSprint().getName());
        sprint.setStartDate(request.getSprint().getStartDate());
        sprint.setEndDate(request.getSprint().getEndDate());
        sprint.setProject(project);
        sprintRepository.save(sprint);
    }

    public List<Project> getTeamProjects(Long teamId) {
        return teamRepository.findById(teamId)
                .map(Team::getProjects)
                .orElse(Collections.emptyList());
    }

    public List<AppUserDto> getTeamMembers(Long teamId) {
        return teamRepository
                .findById(teamId)
                .map(t -> t.getMembers().stream()
                        .map(u -> new AppUserDto(u.getId(), u.getName(), u.getEmail()))
                        .toList())
                .orElse(List.of());
    }

    public boolean addUserToTeam(Long teamId, Long userId) {
        Optional<AppUser> userOptional = appUserRepository.findById(userId);
        Optional<Team> teamOptional = teamRepository.findById(teamId);
    
        if (userOptional.isPresent() && teamOptional.isPresent()) {
            AppUser user = userOptional.get();
            Team team = teamOptional.get();
    
            user.setTeam(team); // This is correct
            appUserRepository.save(user);
            return true;
        }
    
        return false;
    }
    
    
}
