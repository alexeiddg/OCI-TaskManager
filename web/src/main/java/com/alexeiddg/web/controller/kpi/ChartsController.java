package com.alexeiddg.web.controller.kpi;

import DTO.helpers.*;
import com.alexeiddg.web.service.kpi.ChartsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/charts")
@RequiredArgsConstructor
public class ChartsController {
    private final ChartsService chartsService;

    /**
     * Get total hours worked per sprint for a team
     * @param teamId The team ID
     * @return List of SprintTotalHoursDTO objects
     */
    @GetMapping("/hours-per-sprint/{teamId}")
    public ResponseEntity<List<SprintTotalHoursDTO>> getHoursPerSprint(@PathVariable("teamId") Long teamId) {
        return ResponseEntity.ok(chartsService.getHoursPerSprint(teamId));
    }

    /**
     * Get hours worked by team members per sprint
     * @param teamId The team ID
     * @return List of SprintMemberHoursDataDTO objects
     */
    @GetMapping("/hours-by-member/{teamId}")
    public ResponseEntity<List<SprintMemberHoursDataDTO>> getHoursByMemberPerSprint(@PathVariable("teamId") Long teamId) {
        return ResponseEntity.ok(chartsService.getHoursByMemberPerSprint(teamId));
    }

    /**
     * Get completed tasks by team members per sprint
     * @param teamId The team ID
     * @return List of SprintMemberTasksDataDTO objects
     */
    @GetMapping("/tasks-by-member/{teamId}")
    public ResponseEntity<List<SprintMemberTasksDataDTO>> getCompletedTasksByMemberPerSprint(@PathVariable("teamId") Long teamId) {
        return ResponseEntity.ok(chartsService.getCompletedTasksByMemberPerSprint(teamId));
    }

    /**
     * Get task summary data for a team
     * @param teamId The team ID
     * @return List of TaskSummaryDTO objects
     */
    @GetMapping("/task-summary/{teamId}")
    public ResponseEntity<List<TaskSummaryDTO>> getTaskSummary(@PathVariable("teamId") Long teamId) {
        return ResponseEntity.ok(chartsService.getTaskSummary(teamId));
    }
}
