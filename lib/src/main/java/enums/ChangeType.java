package enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum ChangeType {
    CREATE, UPDATE, DELETE, STATUS_CHANGE, ASSIGNMENT_CHANGE
}
