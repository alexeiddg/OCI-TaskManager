package com.alexeiddg.telegram.service;

import com.alexeiddg.telegram.model.Sprint;
import com.alexeiddg.telegram.model.Task;
import com.alexeiddg.telegram.model.TaskStatus;
import com.alexeiddg.telegram.repository.SprintRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SprintServiceTest {

    private SprintRepository sprintRepository;
    private SprintService sprintService;

    @BeforeEach
    void setUp() {
        sprintRepository = mock(SprintRepository.class);
        // Mock other dependencies as needed
        sprintService = new SprintService(
                sprintRepository,
                null, // projectRepository
                null, // appUserRepository
                null  // kpiSnapshotService
        );
    }

    @Test
    void testShowCompletedTasksBySprint() {
        // Arrange
        Sprint sprint = new Sprint();
        sprint.setId(1L);

        Task completedTask = new Task();
        completedTask.setId(100L);
        completedTask.setStatus(TaskStatus.DONE);

        Task inProgressTask = new Task();
        inProgressTask.setId(101L);
        inProgressTask.setStatus(TaskStatus.IN_PROGRESS);

        sprint.setTasks(Arrays.asList(completedTask, inProgressTask));

        when(sprintRepository.findById(1L)).thenReturn(Optional.of(sprint));

        // Act
        List<Task> completedTasks = sprint.getTasks().stream()
                .filter(task -> task.getStatus() == TaskStatus.DONE)
                .toList();

        // Assert
        assertEquals(1, completedTasks.size());
        assertEquals(100L, completedTasks.get(0).getId());
    }
}