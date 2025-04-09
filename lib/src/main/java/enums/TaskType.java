package enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum TaskType {
    BUG,
    FEATURE,
    IMPROVEMENT
}
