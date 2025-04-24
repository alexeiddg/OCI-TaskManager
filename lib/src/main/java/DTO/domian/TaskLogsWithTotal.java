package DTO.domian;

import java.util.List;

public record TaskLogsWithTotal(
        List<TaskLogDto> logs,
        double totalHours
) {
}
