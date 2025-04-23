package com.alexeiddg.web.controller.kpi;

import DTO.domian.kpi.TeamKpiDto;
import DTO.domian.kpi.TeamProgressForecast;
import DTO.domian.kpi.TeamTaskTypeBreakdown;
import DTO.helpers.UserSummaryDto;
import com.alexeiddg.web.service.SprintService;
import com.alexeiddg.web.service.kpi.TeamKpiCalculationService;
import lombok.RequiredArgsConstructor;
import model.Sprint;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/v2/team/kpis")
@RequiredArgsConstructor
public class TeamKpiController {

    private final TeamKpiCalculationService teamKpiService;
    private final SprintService sprintService;

    @GetMapping("/sprint/{sprintId}/team")
    public ResponseEntity<TeamKpiDto> getTeamSprintKpis(
            @PathVariable Long sprintId
    ) {
        // load sprint or 404
        Sprint sprint = sprintService.getSprintById(sprintId);
        if (sprint == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Sprint not found: " + sprintId
            );
        }

        // breakdown & forecast
        TeamTaskTypeBreakdown breakdown = teamKpiService.taskTypeBreakdown(sprint);
        TeamProgressForecast forecast  = teamKpiService.progressForecast(sprint);

        // map top contributors to summary DTOs
        List<UserSummaryDto> topContribs = teamKpiService
                .topContributors(sprint).stream()
                .map(u -> new UserSummaryDto(u.getId(), u.getName()))
                .toList();

        // assemble all 15 metrics
        TeamKpiDto dto = new TeamKpiDto(
                /*1*/ teamKpiService.sprintVelocity(sprint),
                /*2*/ teamKpiService.completionRate(sprint),
                /*3*/ teamKpiService.averageEfficiency(sprint),
                /*4*/ teamKpiService.averageCompletionTime(sprint),
                /*5*/ teamKpiService.bugFeatureRatio(sprint),
                /*6*/ teamKpiService.workloadBalance(sprint),

                /*7*/ teamKpiService.blockedTasks(sprint),
                /*8*/ teamKpiService.highPriorityPending(sprint),
                /*9*/ teamKpiService.overdueTasks(sprint),
                /*10*/teamKpiService.scopeAtRisk(sprint),

                /*11*/teamKpiService.totalTimeLogged(sprint),

                /*12*/breakdown,
                /*13*/forecast,

                /*14*/teamKpiService.focusScore(sprint),
                /*15*/topContribs
        );

        return ResponseEntity.ok(dto);
    }
}
