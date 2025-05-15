package DTO.helpers;

/**
 * DTO for the "Task Hours Table".
 * Represents detailed information for a single task relevant to effort tracking.
 */

public record TaskSummaryDTO(
        Long id,
        String taskName,
        String developerName,
        int estimatedHours, // story points for a task
        int actualHours // Logged hours for a task
) {}
