package com.alexeiddg.web.repository;

import com.alexeiddg.web.model.TaskMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import jakarta.transaction.Transactional;

@Repository
@Transactional
@EnableTransactionManagement
public interface TaskMetricRepository extends JpaRepository<TaskMetric, Long> {

    // Count total assigned tasks for a developer
    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignedTo.userId = :developerId")
    int getTotalAssignedTasksByDeveloper(Long developerId);

    // Count completed tasks for a developer
    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignedTo.userId = :developerId AND t.status = 'COMPLETED'")
    int getCompletedTasksByDeveloper(Long developerId);

    // Get average completion time for a developer
    @Query("SELECT AVG(t.timeInProgress) FROM Task t WHERE t.assignedTo.userId = :developerId AND t.status = 'COMPLETED'")
    Long getAvgCompletionTimeByDeveloper(Long developerId);

    // Count total bugs fixed by a developer
    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignedTo.userId = :developerId AND t.taskType = 'BUG'")
    int getTotalBugsFixedByDeveloper(Long developerId);

    // Count total features completed by a developer
    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignedTo.userId = :developerId AND t.taskType = 'FEATURE'")
    int getTotalFeaturesCompletedByDeveloper(Long developerId);

    // Count total assigned tasks for a team
    @Query("SELECT COUNT(t) FROM Task t WHERE t.team.teamId = :teamId")
    int getTotalAssignedTasksByTeam(Long teamId);

    // Count completed tasks for a team
    @Query("SELECT COUNT(t) FROM Task t WHERE t.team.teamId = :teamId AND t.status = 'COMPLETED'")
    int getCompletedTasksByTeam(Long teamId);

    // Get average completion time for a team
    @Query("SELECT AVG(t.timeInProgress) FROM Task t WHERE t.team.teamId = :teamId AND t.status = 'COMPLETED'")
    Long getAvgCompletionTimeByTeam(Long teamId);

    // Count total bugs fixed by a team
    @Query("SELECT COUNT(t) FROM Task t WHERE t.team.teamId = :teamId AND t.taskType = 'BUG'")
    int getTotalBugsFixedByTeam(Long teamId);

    // Count total features completed by a team
    @Query("SELECT COUNT(t) FROM Task t WHERE t.team.teamId = :teamId AND t.taskType = 'FEATURE'")
    int getTotalFeaturesCompletedByTeam(Long teamId);

    // Count total assigned tasks for a project
    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.projectId = :projectId")
    int getTotalAssignedTasksByProject(Long projectId);

    // Count completed tasks for a project
    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.projectId = :projectId AND t.status = 'COMPLETED'")
    int getCompletedTasksByProject(Long projectId);

    // Calculate sprint velocity
    @Query("SELECT SUM(t.storyPoints) FROM Task t WHERE t.sprint.sprintId = :sprintId AND t.status = 'COMPLETED'")
    float calculateSprintVelocity(Long sprintId);
}
