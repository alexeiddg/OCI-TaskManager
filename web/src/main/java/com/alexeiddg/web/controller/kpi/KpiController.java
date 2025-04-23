package com.alexeiddg.web.controller.kpi;

import DTO.domian.kpi.KpiDto;
import DTO.domian.kpi.ProgressForecast;
import DTO.domian.kpi.TaskTypeBreakdown;
import com.alexeiddg.web.service.AppUserService;
import com.alexeiddg.web.service.SprintService;
import com.alexeiddg.web.service.kpi.KpiCalculationService;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import model.Sprint;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v2/kpis")
@RequiredArgsConstructor
public class KpiController {

    private final KpiCalculationService kpiService;
    private final SprintService sprintService;
    private final AppUserService userService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<KpiDto> getUserSprintKpis(
            @PathVariable("userId") Long userId
    ) {
        AppUser user = userService.getUserById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found with id " + userId
                ));

        Sprint sprint = sprintService.findLatestSprintWithAllRelations(user.getTeam().getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Sprint not found for team " + user.getTeam().getId()
                ));

        TaskTypeBreakdown breakdown = kpiService.getTaskTypeBreakdown(user, sprint);
        ProgressForecast forecast  = kpiService.getProgressForecast(user, sprint);

        KpiDto dto = new KpiDto(
                kpiService.calculateSprintCompletionRate(sprint),
                kpiService.calculateSprintVelocity(sprint),
                kpiService.calculateBugsVsFeatures(sprint),
                kpiService.calculateAverageCompletionTime(sprint),

                kpiService.calculateAverageLoggedHours(user, sprint),
                kpiService.calculateEfficiency(user, sprint),
                kpiService.calculateEstimateAccuracy(user, sprint),
                kpiService.estimateErrorPct(user, sprint),

                kpiService.calculateWorkloadBalance(sprint),
                kpiService.calculateFocusScore(user, sprint),

                kpiService.countBlockedTasks(user),
                kpiService.countHighPriorityPending(user),
                kpiService.countOverdueTasks(user),
                kpiService.isSprintScopeAtRisk(user, sprint),

                breakdown,
                forecast
        );

        return ResponseEntity.ok(dto);
    }
}
