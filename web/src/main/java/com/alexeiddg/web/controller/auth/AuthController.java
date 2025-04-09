package com.alexeiddg.web.controller.auth;

import DTO.auth.LoginRequest;
import DTO.auth.LoginResponse;
import DTO.auth.SignupRequest;
import DTO.auth.SignupResponse;
import com.alexeiddg.web.service.auth.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/v2/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
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
}
