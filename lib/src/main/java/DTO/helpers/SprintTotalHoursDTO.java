package DTO.helpers;

/**
 * DTO for the "Total Hours per Sprint" chart.
 * Represents the total hours worked for a single sprint.
 */

public record SprintTotalHoursDTO(
        String sprintName,
        float totalHours
) {}
