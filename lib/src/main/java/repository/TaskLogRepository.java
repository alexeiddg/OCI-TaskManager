package repository;

import model.AppUser;
import model.Sprint;
import model.Task;
import model.TaskLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskLogRepository extends JpaRepository<TaskLog, Long> {

    List<TaskLog> findByTaskAndUser(Task task, AppUser user);

    @Query("SELECT COALESCE(SUM(tl.hoursLogged), 0) FROM TaskLog tl WHERE tl.task = :task AND tl.user = :user")
    double sumHoursByTaskAndUser(@Param("task") Task task, @Param("user") AppUser user);


    @Query("""
        SELECT COALESCE(SUM(tl.hoursLogged), 0)
        FROM   TaskLog tl
        WHERE  tl.task.id = :taskId
          AND  tl.user.id = :userId
          AND  tl.hoursLogged > 0
    """)
    double sumHoursByTaskAndUser(@Param("taskId") Long taskId,
                                 @Param("userId") Long userId);

    @Query("""
        SELECT COALESCE(SUM(tl.hoursLogged), 0)
        FROM   TaskLog tl
        WHERE  tl.user.id = :userId
          AND  tl.task.sprint.id = :sprintId
          AND  tl.hoursLogged > 0
    """)
    double sumHoursByUserAndSprint(@Param("userId") Long userId,
                                   @Param("sprintId") Long sprintId);

    @Query("""
   SELECT tl
   FROM   TaskLog tl
   WHERE  tl.user = :user
     AND  tl.task.sprint.id = :sprintId
     AND  tl.hoursLogged > 0
   """)
    List<TaskLog> findPositiveLogsByUserAndSprint(@Param("user") AppUser user,
                                                  @Param("sprintId") Long sprintId);

    @Query("""
    SELECT tl
    FROM TaskLog tl
    WHERE tl.task.sprint.id = :sprintId
      AND tl.hoursLogged > :minHours
    """)
    List<TaskLog> findBySprintIdAndHoursGreaterThan(@Param("sprintId") Long sprintId,
                                                    @Param("minHours") double minHours);
}
