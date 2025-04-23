package com.alexeiddg.web.service;

import DTO.domian.SprintDto;
import lombok.RequiredArgsConstructor;
import model.Sprint;
import org.springframework.stereotype.Service;
import repository.SprintRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SprintService {

    private final SprintRepository sprintRepository;

    // Create
    public Sprint createSprint(Sprint sprint) {
        return sprintRepository.save(sprint);
    }

    // Update
    public Sprint updateSprint(Sprint sprint) {
        return sprintRepository.save(sprint);
    }

    // Delete
    public void deleteSprint(Long id) {
        sprintRepository.deleteById(id);
    }

    // Get by Id
    public Sprint getSprintById(Long id) {
        return sprintRepository.findById(id).orElse(null);
    }

    // Get by Project Id
    public List<Sprint> getSprintsByProjectId(Long projectId) {
        return sprintRepository.findByProject_Id(projectId);
    }

    public List<Sprint> getSprintsByTeamId(Long teamId) {
        return sprintRepository.findByProject_Team_Id(teamId);
    }

    public List<SprintDto> getTeamSprints(Long teamId) {
        return sprintRepository
                .findByProject_Team_Id(teamId)
                .stream()
                .map(s -> new SprintDto(
                        s.getId(),
                        s.getSprintName(),
                        s.getStartDate(),
                        s.getEndDate()))
                .toList();
    }

    public Optional<Sprint> findLatestSprintWithAllRelations(Long teamId) {
        return sprintRepository.findLatestSprintWithAllRelations(teamId);
    }

    public List<Sprint> getActiveSprintsByProjectId(Long projectId) {
        return sprintRepository.findByProjectIdAndIsActiveTrue(projectId);
    }
}
