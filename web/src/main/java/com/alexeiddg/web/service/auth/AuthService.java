package com.alexeiddg.web.service.auth;

import DTO.auth.LoginRequest;
import DTO.auth.LoginResponse;
import DTO.auth.SignupRequest;
import DTO.auth.SignupResponse;
import com.alexeiddg.web.service.AppUserService;
import enums.UserRole;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import repository.AppUserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final AppUserService appUserService;
    private final PasswordEncoder passwordEncoder;

    // Validate credentials and map to a LoginResponse DTO
    public Optional<LoginResponse> login(LoginRequest loginRequest) {
        Optional<AppUser> userOpt = appUserRepository.findByUsername(loginRequest.getUsername());
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }

        AppUser user = userOpt.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return Optional.empty();
        }

        // Convert to LoginResponse DTO
        LoginResponse response = new LoginResponse(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getManager() != null ? user.getManager().getId() : null,
                user.getTeam() != null ? user.getTeam().getId() : null
        );
        return Optional.of(response);
    }

    // Validate uniqueness, create and save the user, then return a SignupResponse
    public SignupResponse signup(SignupRequest signupRequest) {
        if (appUserRepository.findByUsername(signupRequest.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if (appUserRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        AppUser newUser = new AppUser();
        newUser.setName(signupRequest.getName());
        newUser.setUsername(signupRequest.getUsername());
        newUser.setEmail(signupRequest.getEmail());
        newUser.setPassword(signupRequest.getPassword());
        newUser.setRole(signupRequest.getRole() != null ? signupRequest.getRole() : UserRole.MANAGER);

        AppUser savedUser = appUserService.createUser(newUser);

        return new SignupResponse(savedUser.getId(), savedUser.getUsername(), "Account created successfully");
    }
}
