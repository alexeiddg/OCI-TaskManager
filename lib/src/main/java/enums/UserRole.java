package enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum UserRole {
    MANAGER,
    DEVELOPER,
}
