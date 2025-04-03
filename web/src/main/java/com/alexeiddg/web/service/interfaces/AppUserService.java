package com.alexeiddg.web.service.interfaces;

import com.alexeiddg.web.model.AppUser;

import java.util.List;
import java.util.Optional;

public interface AppUserService {
    Optional<AppUser> getUserById(Long userId);
    AppUser saveUser(AppUser user);
    void deleteUser(Long userId);

    Optional<AppUser> findUserByUsername(String username);
    List<AppUser> getAllUsers();

    List<AppUser> getUsersByRole(String role);
    boolean userExists(Long userId);

    AppUser assignUserToProject(Long userId, Long projectId);
    AppUser assignUserToTask(Long userId, Long taskId);

    List<AppUser> getUsersWithoutProjects();
}
