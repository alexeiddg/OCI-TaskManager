package DTO.setup;

public record CreateTaskLogRequest(
        Long taskId,
        Long userId,
        double hoursLogged
) { }
