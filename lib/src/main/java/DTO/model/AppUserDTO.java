package DTO.model;

import enums.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppUserDTO {
    private Long id;
    private String name;
    private String username;
    private String email;
    private UserRole role;
    private Long managerId;
    private Long teamId;
}
