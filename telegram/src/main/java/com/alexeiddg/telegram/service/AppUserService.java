package com.alexeiddg.telegram.service;

import com.alexeiddg.telegram.bot.security.PasswordConfig;
import enums.UserRole;
import org.springframework.stereotype.Service;
import repository.AppUserRepository;
import model.AppUser;

import java.util.List;
import java.util.Optional;

@Service
public class AppUserService {
    private final AppUserRepository appUserRepository;
    private final PasswordConfig passwordEncoder;

    public AppUserService(AppUserRepository appUserRepository, PasswordConfig passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // createUser
    public AppUser createUser(AppUser appUser) {
        return appUserRepository.save(appUser);
    }

    // getUserById
    public Optional<AppUser> getUserById(Long id) {
        return appUserRepository.findById(id);
    }

    // getUserByUsername
    public Optional<AppUser> getUserByUsername(String username) {
        return appUserRepository.findByUsername(username);
    }

    // gerUserByTelegramId
    public Optional<AppUser> getUserByTelegramId(String telegramId) {
        return appUserRepository.findByTelegramId(telegramId);
    }

    public Optional<AppUser> getUserByTelegramIdWithTeamAndMembers(String telegramId) {
        return appUserRepository.findByTelegramIdWithTeamAndMembers(telegramId);
    }

    // updateUser
    public AppUser updateUser(AppUser appUser) {
        return appUserRepository.save(appUser);
    }

    // deleteUser
    public void deleteUser(Long id) {
        appUserRepository.deleteById(id);
    }

    // getAllManagers
    public List<AppUser> getAllManagers() {
        return appUserRepository.findAllByRole(UserRole.MANAGER);
    }

    // getAllUsers - protected route
    public List<AppUser> getAllUsers() {
        return appUserRepository.findAll();
    }

    // getAllUsersByRole
    public List<AppUser> getAllUsersByRole(UserRole role) {
        return appUserRepository.findAllByRole(role);
    }

    public boolean checkPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.passwordEncoder().matches(rawPassword, hashedPassword);
    }

    public List<AppUser> getTeamMembers(Long teamId) {
        return appUserRepository.findByTeamId(teamId);
    }
}
