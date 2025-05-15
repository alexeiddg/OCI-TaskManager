package DTO.helpers;

/**
 * Represents the number of completed tasks by an individual team member within a sprint.
 */

public record MemberTasksItemDTO(
        String memberName,
        int completedTasks
) {}
