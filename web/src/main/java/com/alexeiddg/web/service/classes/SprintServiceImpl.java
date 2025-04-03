package com.alexeiddg.web.service.classes;

import com.alexeiddg.web.model.Project;
import com.alexeiddg.web.model.Sprint;
import com.alexeiddg.web.model.Task;
import com.alexeiddg.web.model.Team;
import com.alexeiddg.web.repository.ProjectRepository;
import com.alexeiddg.web.repository.SprintRepository;
import com.alexeiddg.web.repository.TaskRepository;
import com.alexeiddg.web.service.interfaces.SprintService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SprintServiceImpl implements SprintService {
    private final SprintRepository sprintRepository;
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public SprintServiceImpl(SprintRepository sprintRepository, TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.sprintRepository = sprintRepository;
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    public Optional<Sprint> getSprintById(Long sprintId) {
        return sprintRepository.findById(sprintId);
    }

    @Override
    public Sprint saveSprint(Sprint sprint) {
        // Ensure project exists
        Project project = projectRepository.findById(sprint.getProject().getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Validate teams
        for (Team team : sprint.getTeams()) {
            if (!team.getProject().equals(project)) {
                throw new RuntimeException("One or more teams do not belong to the selected project.");
            }
        }

        return sprintRepository.save(sprint);
    }

    @Override
    public void deleteSprint(Long sprintId) {
        sprintRepository.deleteById(sprintId);
    }

    @Override
    public Sprint startSprint(Long sprintId) {
        Optional<Sprint> sprintOpt = sprintRepository.findById(sprintId);
        if (sprintOpt.isPresent()) {
            Sprint sprint = sprintOpt.get();
            sprint.setSprintVelocity(0); // Reset sprint velocity at the start
            sprint.setCompletionRate(0.0f); // Reset completion rate at the start
            return sprintRepository.save(sprint);
        }
        throw new RuntimeException("Sprint not found.");
    }

    @Override
    public Sprint completeSprint(Long sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new RuntimeException("Sprint not found."));

        int completedTasks = getCompletedTasksInSprint(sprintId);
        float completionRate = calculateCompletionRate(sprintId);
        float sprintVelocity = calculateSprintVelocity(sprintId);

        sprint.setCompletedTasks(completedTasks);
        sprint.setCompletionRate(completionRate);
        sprint.setSprintVelocity(sprintVelocity);

        return sprintRepository.save(sprint);
    }

    @Override
    public Sprint updateSprintDetails(Long sprintId, Sprint updatedSprint) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new RuntimeException("Sprint not found."));

        sprint.setSprintName(updatedSprint.getSprintName());
        sprint.setStartDate(updatedSprint.getStartDate());
        sprint.setEndDate(updatedSprint.getEndDate());

        return sprintRepository.save(sprint);
    }

    @Override
    public List<Sprint> getAllSprints() {
        return sprintRepository.findAll();
    }

    @Override
    public List<Sprint> getSprintsByProject(Long projectId) {
        return sprintRepository.findByProjectId(projectId);
    }

    @Override
    public List<Task> getTasksBySprint(Long sprintId) {
        return taskRepository.findTasksBySprintId(sprintId);
    }

    @Override
    public float calculateSprintVelocity(Long sprintId) {
        int completedTasks = getCompletedTasksInSprint(sprintId);
        // velocity is calculated as (Completed tasks / Sprint duration in weeks)
        Optional<Sprint> sprintOpt = sprintRepository.findById(sprintId);
        if (sprintOpt.isPresent()) {
            Sprint sprint = sprintOpt.get();
            long sprintDuration = java.time.temporal.ChronoUnit.WEEKS.between(
                    sprint.getStartDate().toLocalDate(),
                    sprint.getEndDate().toLocalDate()
            );
            return sprintDuration == 0 ? completedTasks : (float) completedTasks / sprintDuration;
        }
        return 0.0f;
    }

    @Override
    public float calculateCompletionRate(Long sprintId) {
        Integer totalTasks = sprintRepository.getTotalTasksInSprint(sprintId);
        if (totalTasks == null || totalTasks == 0) return 0.0f;

        Integer completedTasks = sprintRepository.getCompletedTasksInSprint(sprintId);
        if (completedTasks == null) completedTasks = 0;

        return (completedTasks / (float) totalTasks) * 100;
    }

    private int getCompletedTasksInSprint(Long sprintId) {
        Integer completedTasks = sprintRepository.getCompletedTasksInSprint(sprintId);
        return completedTasks != null ? completedTasks : 0;
    }
}