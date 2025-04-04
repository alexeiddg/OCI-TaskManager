package com.alexeiddg.web.service;

import enums.UserRole;
import model.AppUser;
import org.springframework.stereotype.Service;
import repository.AppUserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class AppUserService {
    private final AppUserRepository appUserRepository;

    public AppUserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
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
}
