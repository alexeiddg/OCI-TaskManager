package DTO.helpers;

import java.util.List;

/**
 * DTO for the "Completed Tasks by Team Member" chart.
 * Contains data for one sprint, including a list of completed tasks by each relevant member.
 */

public record SprintMemberTasksDataDTO(
        String sprintName,
        List<MemberTasksItemDTO> tasksByMember
) {
}
