package repository;

import enums.TaskPriority;
import enums.TaskStatus;
import enums.TaskType;
import model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Filter created tasks by user
    List<Task> findAllByCreatedById(Long userId);

    // Get all tasks for a user
    List<Task> findAllByAssignedToId(Long userId);

    // Get all tasks for a user by sprint
    List<Task> findAllByAssignedToIdAndSprintId(Long userId, Long sprintId);

    // Get all tasks for a sprint
    List<Task> findAllBySprintId(Long sprintId);

    // Filter tasks by status for user
    List<Task> findAllByStatusAndAssignedToId(TaskStatus status, Long userId);

    // Filter tasks by type for user
    List<Task> findAllByTypeAndAssignedToId(TaskType type, Long userId);

    // Filter tasks by priority for user
    List<Task> findAllByPriorityAndAssignedToId(TaskPriority priority, Long userId);

    // Filter tasks by due date for user
    List<Task> findAllByDueDateBeforeAndAssignedToId(LocalDateTime dateTime, Long userId);

    // Filter tasks by story points for user
    List<Task> findAllByStoryPointsGreaterThanEqualAndAssignedToId(int points, Long userId);

    // Filter tasks by blocked status for user
    List<Task> findAllByBlockedTrueAndAssignedToId(Long userId);

    // Filter tasks by completed status for user
    List<Task> findAllByCompletedAtIsNotNullAndAssignedToId(Long userId);

    // Get overdue tasks for user
    List<Task> findAllByDueDateBeforeAndStatusNotAndAssignedToId(LocalDateTime dateTime, TaskStatus status, Long userId);
}
