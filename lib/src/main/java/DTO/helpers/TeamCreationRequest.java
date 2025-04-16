package DTO.helpers;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeamCreationRequest {
    private String teamName;
    // private List<String> invitedEmails;

    private ProjectData project;
    private SprintData sprint;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectData {
        private String name;
        private String description;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SprintData {
        private String name;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
    }
}
