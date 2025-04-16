package com.alexeiddg.web.controller.auth;

import DTO.auth.LoginRequest;
import DTO.auth.LoginResponse;
import DTO.auth.SignupRequest;
import DTO.auth.SignupResponse;
import com.alexeiddg.web.security.JwtTokenProvider;
import com.alexeiddg.web.service.auth.AuthService;
import model.AppUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import repository.AppUserRepository;

import java.util.Optional;

@RestController
@RequestMapping("/api/v2/auth")
public class AuthController {

    private final AuthService authService;
    private final AppUserRepository appUserRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(AuthService authService, AppUserRepository appUserRepository, JwtTokenProvider jwtTokenProvider) {
        this.authService = authService;
        this.appUserRepository = appUserRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * Login endpoint:
     * Accepts a JSON payload with username and password,
     * validates credentials via AuthService,
     * and returns a LoginResponse if successful.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<LoginResponse> loginResponse = authService.login(loginRequest);
        if (loginResponse.isPresent()) {
            return ResponseEntity.ok(loginResponse.get());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }
    }

    /**
     * Signup endpoint:
     * Accepts a JSON payload with user details,
     * creates a new user if the username and email are unique,
     * and returns a SignupResponse upon successful registration.
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        try {
            SignupResponse response = authService.signup(signupRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        LoginResponse refreshed = authService.refreshToken(token);
        return ResponseEntity.ok(refreshed);
    }

    @GetMapping("/me")
    public ResponseEntity<LoginResponse> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        AppUser user = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtTokenProvider.generateToken(user);

        return ResponseEntity.ok(new LoginResponse(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getManager() != null ? user.getManager().getId() : null,
                user.getTeam() != null ? user.getTeam().getId() : null,
                token
        ));
    }
}
