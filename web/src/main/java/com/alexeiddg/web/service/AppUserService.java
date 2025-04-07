package com.alexeiddg.web.service;

import enums.UserRole;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import org.springframework.stereotype.Service;
import repository.AppUserRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository appUserRepository;

    // Create User
    public AppUser createUser(AppUser appUser) {
        appUserRepository.save(appUser);
        return appUser;
    }

    // Read User by Id
    public Optional<AppUser> getUserById(Long id) {
        return appUserRepository.findById(id);
    }

    // Read User by Username
    public Optional<AppUser> getUserByUsername(String username) {
        return appUserRepository.findByUsername(username);
    }

    // Read User by Telegram Id
    public Optional<AppUser> getUserByTelegramId(String telegramId) {
        return appUserRepository.findByTelegramId(telegramId);
    }

    // Read user by Email
    public Optional<AppUser> getUserByEmail(String email) {
        return appUserRepository.findByEmail(email);
    }

    // Update User
    public AppUser updateUser(AppUser appUser) {
        return appUserRepository.save(appUser);
    }

    // Delete User
    public void deleteUser(Long id) {
        appUserRepository.deleteById(id);
    }

    // Get All Users by team where user is manager
    public List<AppUser> getDevelopersByTeam(Long teamId) {
        return appUserRepository.findByTeamIdAndRole(teamId, UserRole.DEVELOPER);
    }

    // Get All Users by team where user is developer
    public List<AppUser> getManagersByTeam(Long teamId) {
        return appUserRepository.findByTeamIdAndRole(teamId, UserRole.MANAGER);
    }

    // Get all users - protected route
    public List<AppUser> getAllUsers() {
        return appUserRepository.findAll();
    }
}
