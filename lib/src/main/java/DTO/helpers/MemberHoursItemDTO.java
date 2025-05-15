package DTO.helpers;

/**
 * Represents the hours worked by an individual team member within a sprint.
 */
public record MemberHoursItemDTO(
        String memberName,
        float hours
) {}
