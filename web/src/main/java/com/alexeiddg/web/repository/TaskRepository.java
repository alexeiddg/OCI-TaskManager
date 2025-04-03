package com.alexeiddg.web.repository;

import com.alexeiddg.web.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import jakarta.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
@EnableTransactionManagement
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t WHERE t.sprint.sprintId = :sprintId")
    List<Task> findTasksBySprintId(@Param("sprintId") Long sprintId);

    // Find tasks based on user, team, sprint, and project
    List<Task> findByAssignedToUserId(Long userId);
    List<Task> findByTeamTeamId(Long teamId);
    List<Task> findBySprintSprintId(Long sprintId);
    List<Task> findByProjectProjectId(Long projectId);

    // Count total, completed, and blocked tasks in a sprint
    @Query("SELECT COUNT(t) FROM Task t WHERE t.sprint.sprintId = :sprintId")
    int getTotalTasksBySprint(Long sprintId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.sprint.sprintId = :sprintId AND t.status = 'COMPLETED'")
    int getCompletedTasksBySprint(Long sprintId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.sprint.sprintId = :sprintId AND t.blocked = true")
    int getBlockedTasksBySprint(Long sprintId);

    // Count total and completed tasks in a project
    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.projectId = :projectId")
    int getTotalTasksByProject(Long projectId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.projectId = :projectId AND t.status = 'COMPLETED'")
    int getCompletedTasksByProject(Long projectId);
}
