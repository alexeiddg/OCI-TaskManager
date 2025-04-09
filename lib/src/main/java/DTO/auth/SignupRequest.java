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
public class SignupRequest {
    private String name;
    private String username;
    private String password;
    private String email;
    private UserRole role;
}
