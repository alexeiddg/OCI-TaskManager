package DTO.domian;

import java.time.LocalDateTime;

public record TaskLogDto(
        Long id,
        Long taskId,
        Long userId,
        double hoursLogged,
        LocalDateTime logDate
) {}
