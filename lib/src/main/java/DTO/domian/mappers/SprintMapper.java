package DTO.domian.mappers;

import DTO.domian.SprintDto;
import model.Sprint;

public final class SprintMapper {
    public static SprintDto toDto(Sprint s) {
        return new SprintDto(
                s.getId(),
                s.getSprintName(),
                s.getStartDate(),
                s.getEndDate()
        );
    }
}
