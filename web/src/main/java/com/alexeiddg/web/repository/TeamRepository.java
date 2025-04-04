package com.alexeiddg.web.repository;

import com.alexeiddg.web.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import jakarta.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
@EnableTransactionManagement
public interface TeamRepository extends JpaRepository<Team, Long> {

    // Retrieve all teams belonging to a project
    @Query("SELECT t FROM Team t WHERE t.project.projectId = :projectId")
    List<Team> findByProjectId(Long projectId);

    // Count the number of users assigned to a team
    @Query("SELECT COUNT(u) FROM Team t JOIN t.users u WHERE t.teamId = :teamId")
    int countUsersInTeam(Long teamId);

    // Count the number of tasks assigned to a team
    @Query("SELECT COUNT(t) FROM Task t WHERE t.team.teamId = :teamId")
    int countTasksAssignedToTeam(Long teamId);

    @Query("SELECT t FROM Team t WHERE t.project.projectId = :projectId")
    List<Team> findTeamsByProjectId(Long projectId);
}
