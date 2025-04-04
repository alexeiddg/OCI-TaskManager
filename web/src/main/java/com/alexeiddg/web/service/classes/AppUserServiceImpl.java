package com.alexeiddg.web.service.classes;

import com.alexeiddg.web.model.AppUser;
import com.alexeiddg.web.model.Project;
import com.alexeiddg.web.model.Task;
import com.alexeiddg.web.repository.AppUserRepository;
import com.alexeiddg.web.repository.ProjectRepository;
import com.alexeiddg.web.repository.TaskRepository;
import com.alexeiddg.web.service.interfaces.AppUserService;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
public class AppUserServiceImpl implements AppUserService {
    private final AppUserRepository appUserRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public AppUserServiceImpl(
            AppUserRepository appUserRepository,
            ProjectRepository projectRepository,
            TaskRepository taskRepository) {
        this.appUserRepository = appUserRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    public Optional<AppUser> getUserById(Long userid) {
        return appUserRepository.findById(userid);
    }

    @Override
    public AppUser saveUser(AppUser user) {
        if (user.getCreatedAt() == null) {
            user.setCreatedAt(OffsetDateTime.now());
        }
        return appUserRepository.save(user);
    }

    @Override
    public void deleteUser(Long userId) {
        appUserRepository.deleteById(userId);
    }

    @Override
    public Optional<AppUser> findUserByUsername(String username) {
        return appUserRepository.findByUsername(username);
    }

    @Override
    public List<AppUser> getAllUsers(){
        return appUserRepository.findAll();
    }

    @Override
    public List<AppUser> getUsersByRole(String role) {
        return appUserRepository.findByRole(role);
    }

    @Override
    public boolean userExists(Long userId) {
        return appUserRepository.existsById(userId);
    }

    @Override
    public AppUser assignUserToProject(Long userId, Long projectId) {
        Optional<AppUser> userOpt = appUserRepository.findById(userId);
        Optional<Project> projectOpt = projectRepository.findById(projectId);

        if (userOpt.isPresent() && projectOpt.isPresent()) {
            AppUser user = userOpt.get();
            Project project = projectOpt.get();

            // Check if the user is already assigned to another project
            List<Project> existingProjects = projectRepository.findByDevelopersContaining(user);
            if (!existingProjects.isEmpty()) {
                throw new RuntimeException("User is already assigned to another project.");
            }

            // Check if user is a Manager
            if (user.getRole().equals("MANAGER")) {
                if (project.getManager() != null) {
                    throw new RuntimeException("Project already has a manager.");
                }
                project.setManager(user);
            }
            // If user is a Developer, ensure they are not assigned to another project
            else if (user.getRole().equals("DEVELOPER")) {
                if (project.getDevelopers() == null) {
                    project.setDevelopers(new HashSet<>()); // Prevent NullPointerException
                }
                project.getDevelopers().add(user);
            } else {
                throw new RuntimeException("Invalid user role.");
            }

            projectRepository.save(project);
            return appUserRepository.save(user);
        }
        throw new RuntimeException("User or Project not found.");
    }

    @Override
    public AppUser assignUserToTask(Long userId, Long taskId) {
        Optional<AppUser> userOpt = appUserRepository.findById(userId);
        Optional<Task> taskOpt = taskRepository.findById(taskId);

        if (userOpt.isPresent() && taskOpt.isPresent()) {
            AppUser user = userOpt.get();
            Task task = taskOpt.get();

            // Assign user to the task
            task.setAssignedTo(user);
            taskRepository.save(task);

            return appUserRepository.save(user);
        }
        throw new RuntimeException("User or Task not found.");
    }

    @Override
    public List<AppUser> getUsersWithoutProjects() {
        return appUserRepository.findUsersWithoutProjects();
    }
}
