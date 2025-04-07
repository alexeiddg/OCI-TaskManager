package com.alexeiddg.web.controller;

import com.alexeiddg.web.service.AppUserService;
import model.AppUser;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v2/user")
public class AppUserController {

    private final AppUserService appUserService;

    public AppUserController(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

    @PostMapping
    public ResponseEntity<AppUser> createUser(@RequestBody AppUser appUser) {
        AppUser saved = appUserService.createUser(appUser);
        return ResponseEntity.ok(saved);
    }

    // Get User by ID
    @GetMapping("/{id}")
    public ResponseEntity<AppUser> getUserById(@PathVariable Long id) {
        return appUserService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Search by username, email, telegramId
    @GetMapping("/search")
    public ResponseEntity<AppUser> searchUser(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String telegramId
    ) {
        Optional<AppUser> result = Optional.empty();

        if (username != null) result = appUserService.getUserByUsername(username);
        else if (email != null) result = appUserService.getUserByEmail(email);
        else if (telegramId != null) result = appUserService.getUserByTelegramId(telegramId);

        return result.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<AppUser> updateUser(@PathVariable Long id, @RequestBody AppUser appUser) {
        appUser.setId(id);
        return ResponseEntity.ok(appUserService.updateUser(appUser));
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        appUserService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // Get all users
    @GetMapping
    public ResponseEntity<List<AppUser>> getAllUsers() {
        return ResponseEntity.ok(appUserService.getAllUsers());
    }

    // Get all developers by team
    @GetMapping("/teams/{teamId}/developers")
    public ResponseEntity<List<AppUser>> getDevelopersByTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(appUserService.getDevelopersByTeam(teamId));
    }

    // Get all managers by team
    @GetMapping("/teams/{teamId}/managers")
    public ResponseEntity<List<AppUser>> getManagersByTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(appUserService.getManagersByTeam(teamId));
    }
}
