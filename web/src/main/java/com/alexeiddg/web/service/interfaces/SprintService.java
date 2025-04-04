package com.alexeiddg.web.service.interfaces;

import com.alexeiddg.web.model.Sprint;
import com.alexeiddg.web.model.Task;

import java.util.List;
import java.util.Optional;

public interface SprintService {
    Optional<Sprint> getSprintById(Long sprintId);
    Sprint saveSprint(Sprint sprint);
    void deleteSprint(Long sprintId);

    // Managing Sprints
    Sprint startSprint(Long sprintId);
    Sprint completeSprint(Long sprintId);
    Sprint updateSprintDetails(Long sprintId, Sprint updatedSprint);

    // Retrieving Sprint Information
    List<Sprint> getAllSprints();
    List<Sprint> getSprintsByProject(Long projectId);
    List<Task> getTasksBySprint(Long sprintId);

    // Sprint Performance KPIs
    float calculateSprintVelocity(Long sprintId);
    float calculateCompletionRate(Long sprintId);
}
