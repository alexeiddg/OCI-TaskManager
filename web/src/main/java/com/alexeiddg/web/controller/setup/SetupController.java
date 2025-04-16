package com.alexeiddg.web.controller.setup;

import DTO.setup.TeamCreationRequest;
import com.alexeiddg.web.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v2/setup")
@RequiredArgsConstructor
public class SetupController {

    private final TeamService teamService;

    @PostMapping("/multi-create")
    public ResponseEntity<?> createAll(@RequestBody TeamCreationRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        teamService.createTeamWithProjectAndSprint(request, username);
        return ResponseEntity.status(HttpStatus.CREATED).body("Setup completed");
    }
}
