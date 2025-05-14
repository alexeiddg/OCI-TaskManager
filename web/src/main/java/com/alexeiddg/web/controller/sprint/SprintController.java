package com.alexeiddg.web.controller.sprint;

import DTO.domian.SprintDto;
import DTO.domian.kpi.SprintWithDepsDto;
import DTO.domian.mappers.SprintMapper;
import DTO.helpers.SprintCardDto;
import DTO.helpers.mappers.SprintCardMapper;
import com.alexeiddg.web.service.SprintService;
import enums.SprintStatus;
import model.Sprint;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2/sprint")
public class SprintController {

    private final SprintService sprintService;

    public SprintController(SprintService sprintService) {
        this.sprintService = sprintService;
    }

    // createSprint
    @PostMapping
    public ResponseEntity<Sprint> createSprint(@RequestBody Sprint sprint) {
        return ResponseEntity.ok(sprintService.createSprint(sprint));
    }

    // updateSprint
    @PutMapping("/{id}")
    public ResponseEntity<Sprint> updateSprint(@PathVariable("id") Long id, @RequestBody Sprint sprint) {
        sprint.setId(id);
        return ResponseEntity.ok(sprintService.updateSprint(sprint));
    }

    // deleteSprint
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSprint(@PathVariable("id") Long id) {
        sprintService.deleteSprint(id);
        return ResponseEntity.noContent().build();
    }

    // getSprintById
    @GetMapping("/{id}")
    public ResponseEntity<Sprint> getSprintById(@PathVariable("id") Long id) {
        Sprint sprint = sprintService.getSprintById(id);
        return sprint != null ? ResponseEntity.ok(sprint) : ResponseEntity.notFound().build();
    }

    // getSprintsByProjectId
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<SprintDto>> getSprintsByProjectId(
            @PathVariable("projectId") Long projectId) {

        List<SprintDto> dto = sprintService.getSprintsByProjectId(projectId)
                .stream()
                .map(SprintMapper::toDto)
                .toList();

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<SprintDto>> getSprintsByTeamId(@PathVariable("teamId") Long teamId) {
        return ResponseEntity.ok(sprintService.getTeamSprints(teamId));
    }

    @GetMapping("/project/{projectId}/sprints")
    public ResponseEntity<List<SprintCardDto>> getSprintsWithTasks(@PathVariable("projectId") Long projectId) {
        List<Sprint> sprints = sprintService.getActiveSprintsByProjectId(projectId);
        List<SprintCardDto> result = sprints.stream()
                .map(SprintCardMapper::toDto)
                .toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/team/{teamId}/latest-sprint")
    public ResponseEntity<SprintDto> getLatestSprintByTeamId(@PathVariable("teamId") Long teamId) {
        Sprint sprint = sprintService.findLatestSprintWithAllRelations(teamId).orElse(null);
        return sprint != null ? ResponseEntity.ok(SprintMapper.toDto(sprint)) : ResponseEntity.notFound().build();
    }

    /**
     * Returns the latest active sprint (with full dependencies)
     * for the provided teamId.
     */
    @GetMapping("/latest")
    public ResponseEntity<SprintWithDepsDto> getLatestByTeam(@RequestParam("teamId") Long teamId) {
        SprintWithDepsDto dto = sprintService.getLatestSprint(teamId);
        return ResponseEntity.ok(dto);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Sprint> updateSprintStatus(
            @PathVariable("id") Long id,
            @RequestParam("status") SprintStatus status) {

        Sprint updated = sprintService.updateSprintStatus(id, status);
        return ResponseEntity.ok(updated);
    }
}
