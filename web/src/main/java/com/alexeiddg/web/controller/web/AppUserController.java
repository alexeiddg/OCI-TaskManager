package com.alexeiddg.web.controller.web;

import com.alexeiddg.web.model.AppUser;
import com.alexeiddg.web.service.interfaces.AppUserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/user")
public class AppUserController {
    private final AppUserService appUserService;

    public AppUserController(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

    // Get all users
    @GetMapping
    public ResponseEntity<List<AppUser>> getAllUsers() {
        return ResponseEntity.ok(appUserService.getAllUsers());
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<AppUser> getUserById(@PathVariable Long id) {
        Optional<AppUser> user = appUserService.getUserById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new user
    @PostMapping
    public ResponseEntity<AppUser> createUser(@RequestBody AppUser user) {
        return ResponseEntity.ok(appUserService.saveUser(user));
    }

    // Delete a user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        appUserService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // Find user by username
    @GetMapping("/username/{username}")
    public ResponseEntity<AppUser> getUserByUsername(@PathVariable String username) {
        Optional<AppUser> user = appUserService.findUserByUsername(username);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get users by role
    @GetMapping("/role/{role}")
    public ResponseEntity<List<AppUser>> getUsersByRole(@PathVariable String role) {
        return ResponseEntity.ok(appUserService.getUsersByRole(role));
    }

    // Assign user to project
    @PostMapping("/{userId}/assign-project/{projectId}")
    public ResponseEntity<AppUser> assignUserToProject(@PathVariable Long userId, @PathVariable Long projectId) {
        return ResponseEntity.ok(appUserService.assignUserToProject(userId, projectId));
    }

    // Assign user to task
    @PostMapping("/{userId}/assign-task/{taskId}")
    public ResponseEntity<AppUser> assignUserToTask(@PathVariable Long userId, @PathVariable Long taskId) {
        return ResponseEntity.ok(appUserService.assignUserToTask(userId, taskId));
    }

    @GetMapping("/without-projects")
    public ResponseEntity<List<AppUser>> getUsersWithoutProjects() {
        return ResponseEntity.ok(appUserService.getUsersWithoutProjects());
    }
}
