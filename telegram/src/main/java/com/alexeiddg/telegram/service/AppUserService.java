package com.alexeiddg.telegram.service;

import org.checkerframework.checker.units.qual.A;
import org.springframework.stereotype.Service;
import repository.AppUserRepository;
import model.AppUser;

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

    // create user from telegram
    public AppUser createUserFromTelegram(String telegramId, String username) {
        AppUser appUser = new AppUser();
        appUser.setTelegramId(telegramId);
        appUser.setUsername(username);
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

    // getAllUsers - protected route
    public List<AppUser> getAllUsers() {
        return appUserRepository.findAll();
    }
}
