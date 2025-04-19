package enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum SprintStatus {
    ACTIVE, COMPLETED, PLANNING, CANCELLED
}
