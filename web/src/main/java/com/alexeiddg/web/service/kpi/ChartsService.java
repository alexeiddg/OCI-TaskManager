package com.alexeiddg.web.service.kpi;

import DTO.domian.TaskLogDto;
import DTO.helpers.*;
import com.alexeiddg.web.service.SprintService;
import com.alexeiddg.web.service.TaskLogService;
import com.alexeiddg.web.service.TaskService;
import enums.TaskStatus;
import lombok.RequiredArgsConstructor;
import model.Sprint;
import model.Task;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChartsService {
    private final SprintService sprintService;
    private final TaskService taskService;
    private final TaskLogService taskLogService;

    /**
     * Get total hours worked per sprint for a team
     * @param teamId The team ID
     * @return List of SprintTotalHoursDTO objects
     */
    public List<SprintTotalHoursDTO> getHoursPerSprint(Long teamId) {
        List<Sprint> sprints = sprintService.getSprintsByTeamId(teamId);
        List<SprintTotalHoursDTO> result = new ArrayList<>();

        for (Sprint sprint : sprints) {
            // Get all tasks for this sprint
            List<Task> tasks = taskService.getTasksBySprint(sprint.getId());

            // Sum up the hours for all tasks
            float totalHours = 0;
            for (Task task : tasks) {
                if (task.getAssignedTo() != null) {
                    // Get logs for this task and user
                    List<TaskLogDto> logs = taskLogService.getLogsForTaskAndUser(task.getId(), task.getAssignedTo().getId());
                    for (TaskLogDto log : logs) {
                        totalHours += (float) log.hoursLogged();
                    }
                }
            }

            result.add(new SprintTotalHoursDTO(sprint.getSprintName(), totalHours));
        }

        return result;
    }

    /**
     * Get hours worked by team members per sprint
     * @param teamId The team ID
     * @return List of SprintMemberHoursDataDTO objects
     */
    public List<SprintMemberHoursDataDTO> getHoursByMemberPerSprint(Long teamId) {
        List<Sprint> sprints = sprintService.getSprintsByTeamId(teamId);
        List<SprintMemberHoursDataDTO> result = new ArrayList<>();

        for (Sprint sprint : sprints) {
            // Get all tasks for this sprint
            List<Task> tasks = taskService.getTasksBySprint(sprint.getId());

            // Group tasks by assigned user
            Map<Long, String> memberNames = new HashMap<>();
            Map<Long, Float> memberHoursMap = new HashMap<>();

            for (Task task : tasks) {
                if (task.getAssignedTo() != null) {
                    Long userId = task.getAssignedTo().getId();
                    memberNames.putIfAbsent(userId, task.getAssignedTo().getName());

                    // Get logs for this task and user
                    List<TaskLogDto> logs = taskLogService.getLogsForTaskAndUser(task.getId(), userId);

                    // Sum up hours for this user
                    float userHours = memberHoursMap.getOrDefault(userId, 0.0f);
                    for (TaskLogDto log : logs) {
                        userHours += (float) log.hoursLogged();
                    }
                    memberHoursMap.put(userId, userHours);
                }
            }

            // Convert to DTOs
            List<MemberHoursItemDTO> memberHours = new ArrayList<>();
            for (Map.Entry<Long, Float> entry : memberHoursMap.entrySet()) {
                if (entry.getValue() > 0) {
                    memberHours.add(new MemberHoursItemDTO(
                        memberNames.get(entry.getKey()),
                        entry.getValue()
                    ));
                }
            }

            result.add(new SprintMemberHoursDataDTO(sprint.getSprintName(), memberHours));
        }

        return result;
    }

    /**
     * Get completed tasks by team members per sprint
     * @param teamId The team ID
     * @return List of SprintMemberTasksDataDTO objects
     */
    public List<SprintMemberTasksDataDTO> getCompletedTasksByMemberPerSprint(Long teamId) {
        List<Sprint> sprints = sprintService.getSprintsByTeamId(teamId);
        List<SprintMemberTasksDataDTO> result = new ArrayList<>();

        for (Sprint sprint : sprints) {
            // Get all tasks for this sprint
            List<Task> tasks = taskService.getTasksBySprint(sprint.getId());

            // Group tasks by assigned user
            Map<Long, String> memberNames = new HashMap<>();
            Map<Long, Integer> memberTasksMap = new HashMap<>();

            for (Task task : tasks) {
                if (task.getAssignedTo() != null && task.getStatus() == TaskStatus.DONE) {
                    Long userId = task.getAssignedTo().getId();
                    memberNames.putIfAbsent(userId, task.getAssignedTo().getName());

                    // Increment completed tasks count for this user
                    int completedTasks = memberTasksMap.getOrDefault(userId, 0);
                    memberTasksMap.put(userId, completedTasks + 1);
                }
            }

            // Convert to DTOs
            List<MemberTasksItemDTO> memberTasks = new ArrayList<>();
            for (Map.Entry<Long, Integer> entry : memberTasksMap.entrySet()) {
                if (entry.getValue() > 0) {
                    memberTasks.add(new MemberTasksItemDTO(
                        memberNames.get(entry.getKey()),
                        entry.getValue()
                    ));
                }
            }

            result.add(new SprintMemberTasksDataDTO(sprint.getSprintName(), memberTasks));
        }

        return result;
    }

    /**
     * Get task summary data for a team
     * @param teamId The team ID
     * @return List of TaskSummaryDTO objects
     */
    public List<TaskSummaryDTO> getTaskSummary(Long teamId) {
        List<Sprint> sprints = sprintService.getSprintsByTeamId(teamId);
        List<TaskSummaryDTO> result = new ArrayList<>();

        for (Sprint sprint : sprints) {
            // Get all tasks for this sprint
            List<Task> tasks = taskService.getTasksBySprint(sprint.getId());

            for (Task task : tasks) {
                // Calculate total hours logged for this task
                double totalHoursLogged = 0;
                if (task.getAssignedTo() != null) {
                    List<TaskLogDto> logs = taskLogService.getLogsForTaskAndUser(task.getId(), task.getAssignedTo().getId());
                    for (TaskLogDto log : logs) {
                        totalHoursLogged += log.hoursLogged();
                    }
                }

                result.add(new TaskSummaryDTO(
                    task.getId(),
                    task.getTaskName(),
                    task.getAssignedTo() != null ? task.getAssignedTo().getName() : "Unassigned",
                    task.getStoryPoints(),
                    (int)totalHoursLogged
                ));
            }
        }

        return result;
    }
}
