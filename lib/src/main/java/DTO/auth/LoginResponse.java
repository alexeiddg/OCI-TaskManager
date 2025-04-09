package DTO.auth;

import enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private Long id;
    private String name;
    private String username;
    private String email;
    private UserRole role;
    private Long managerId;
    private Long teamId;
}
