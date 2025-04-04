package com.alexeiddg.web.service.classes;

import com.alexeiddg.web.model.AppUser;
import com.alexeiddg.web.model.Project;
import com.alexeiddg.web.model.Team;
import com.alexeiddg.web.repository.AppUserRepository;
import com.alexeiddg.web.repository.ProjectRepository;
import com.alexeiddg.web.repository.TeamRepository;
import com.alexeiddg.web.service.interfaces.TeamService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeamServiceImpl implements TeamService {
    private final TeamRepository teamRepository;
    private final AppUserRepository appUserRepository;
    private final ProjectRepository projectRepository;

    public TeamServiceImpl
            (TeamRepository teamRepository,
             AppUserRepository appUserRepository,
             ProjectRepository projectRepository) {
        this.teamRepository = teamRepository;
        this.appUserRepository = appUserRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    public Optional<Team> getTeamById(Long teamId) {
        return teamRepository.findById(teamId);
    }

    @Override
    public Team saveTeam(Team team) {
        return teamRepository.save(team);
    }

    @Override
    public void deleteTeam(Long teamId) {
        teamRepository.deleteById(teamId);
    }

    @Override
    public Team assignUserToTeam(Long teamId, Long userId) {
        Optional<Team> teamOpt = teamRepository.findById(teamId);
        Optional<AppUser> userOpt = appUserRepository.findById(userId);

        if (teamOpt.isPresent() && userOpt.isPresent()) {
            Team team = teamOpt.get();
            AppUser user = userOpt.get();

            team.getUsers().add(user);
            return teamRepository.save(team);
        }
        throw new RuntimeException("Team or User not found.");
    }

    @Override
    public Team removeUserFromTeam(Long teamId, Long userId) {
        Optional<Team> teamOpt = teamRepository.findById(teamId);
        Optional<AppUser> userOpt = appUserRepository.findById(userId);

        if (teamOpt.isPresent() && userOpt.isPresent()) {
            Team team = teamOpt.get();
            AppUser user = userOpt.get();

            team.getUsers().remove(user);
            return teamRepository.save(team);
        }
        throw new RuntimeException("Team or User not found.");
    }

    @Override
    public Team assignTeamToProject(Long teamId, Long projectId) {
        Optional<Team> teamOpt = teamRepository.findById(teamId);
        Optional<Project> projectOpt = projectRepository.findById(projectId);

        if (teamOpt.isPresent() && projectOpt.isPresent()) {
            Team team = teamOpt.get();
            Project project = projectOpt.get();

            team.setProject(project);
            return teamRepository.save(team);
        }
        throw new RuntimeException("Team or Project not found.");
    }

    @Override
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    @Override
    public List<Team> getTeamsByProject(Long projectId) {
        return teamRepository.findByProjectId(projectId);
    }

    @Override
    public int countUsersInTeam(Long teamId) {
        return teamRepository.countUsersInTeam(teamId);
    }

    @Override
    public int countTasksAssignedToTeam(Long teamId) {
        return teamRepository.countTasksAssignedToTeam(teamId);
    }

    @Override
    public List<Team> getTeamsByProjectId(Long projectId) {
        return teamRepository.findTeamsByProjectId(projectId);
    }
}