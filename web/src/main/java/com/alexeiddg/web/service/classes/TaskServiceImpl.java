package com.alexeiddg.web.service.classes;

import com.alexeiddg.web.model.AppUser;
import com.alexeiddg.web.model.Task;
import com.alexeiddg.web.repository.AppUserRepository;
import com.alexeiddg.web.repository.TaskRepository;
import com.alexeiddg.web.service.interfaces.TaskService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;
    private final AppUserRepository appUserRepository;

    public TaskServiceImpl(TaskRepository taskRepository, AppUserRepository appUserRepository) {
        this.taskRepository = taskRepository;
        this.appUserRepository = appUserRepository;
    }

    @Override
    public Optional<Task> getTaskById(Long taskId) {
        return taskRepository.findById(taskId);
    }

    @Override
    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    @Override
    public Task assignTaskToUser(Long taskId, Long userId) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        Optional<AppUser> userOpt = appUserRepository.findById(userId);

        if (taskOpt.isPresent() && userOpt.isPresent()) {
            Task task = taskOpt.get();
            AppUser user = userOpt.get();

            task.setAssignedTo(user);
            return taskRepository.save(task);
        }
        throw new RuntimeException("Task or User not found.");
    }

    @Override
    public Task updateTaskStatus(Long taskId, String status) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            task.setStatus(status);
            return taskRepository.save(task);
        }
        throw new RuntimeException("Task not found.");
    }

    @Override
    public Task setTaskBlocked(Long taskId, boolean isBlocked) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            task.setBlocked(isBlocked);
            return taskRepository.save(task);
        }
        throw new RuntimeException("Task not found.");
    }

    @Override
    public List<Task> getTasksByAssignedUser(Long userId) {
        return taskRepository.findByAssignedToUserId(userId);
    }

    @Override
    public List<Task> getTasksByTeam(Long teamId) {
        return taskRepository.findByTeamTeamId(teamId);
    }

    @Override
    public List<Task> getTasksBySprint(Long sprintId) {
        return taskRepository.findBySprintSprintId(sprintId);
    }

    @Override
    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectProjectId(projectId);
    }

    @Override
    public int getTotalTasksBySprint(Long sprintId) {
        return taskRepository.getTotalTasksBySprint(sprintId);
    }

    @Override
    public int getCompletedTasksBySprint(Long sprintId) {
        return taskRepository.getCompletedTasksBySprint(sprintId);
    }

    @Override
    public int getBlockedTasksBySprint(Long sprintId) {
        return taskRepository.getBlockedTasksBySprint(sprintId);
    }

    @Override
    public int getTotalTasksByProject(Long projectId) {
        return taskRepository.getTotalTasksByProject(projectId);
    }

    @Override
    public int getCompletedTasksByProject(Long projectId) {
        return taskRepository.getCompletedTasksByProject(projectId);
    }
}
