package DTO.helpers;

import java.util.List;

/**
 * DTO for the "Hours Worked by Team Member" chart.
 * Contains data for one sprint, including a list of hours worked by each relevant member.
 */

public record SprintMemberHoursDataDTO(
        String sprintName,
        List<MemberHoursItemDTO> hoursByMember
) {}
