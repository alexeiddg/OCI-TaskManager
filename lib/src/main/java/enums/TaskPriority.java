package enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum TaskPriority {
    LOW,
    MEDIUM,
    HIGH
}
