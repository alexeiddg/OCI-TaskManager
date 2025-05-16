package com.alexeiddg.telegram.bot;

import com.alexeiddg.telegram.service.TaskService;
import enums.TaskStatus;
import model.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CompletedTasksByUserTest {

    private TaskService taskService;

    @BeforeEach
    void setUp() {
        taskService = mock(TaskService.class);
    }

    @Test
    void testShowCompletedTasksByUser() {
        // Arrange
        Long userId = 42L;

        Task completedTask1 = new Task();
        completedTask1.setId(1L);
        completedTask1.setStatus(TaskStatus.DONE);

        Task completedTask2 = new Task();
        completedTask2.setId(2L);
        completedTask2.setStatus(TaskStatus.DONE);

        Task inProgressTask = new Task();
        inProgressTask.setId(3L);
        inProgressTask.setStatus(TaskStatus.IN_PROGRESS);

        List<Task> allTasks = Arrays.asList(completedTask1, completedTask2, inProgressTask);

        when(taskService.getTasksAssignedToUser(userId)).thenReturn(allTasks);

        // Act
        List<Task> completedTasks = taskService.getTasksAssignedToUser(userId).stream()
                .filter(task -> task.getStatus() == TaskStatus.DONE)
                .toList();

        // Assert
        assertEquals(2, completedTasks.size());
        assertTrue(completedTasks.stream().allMatch(task -> task.getStatus() == TaskStatus.DONE));
        assertEquals(1L, completedTasks.get(0).getId());
        assertEquals(2L, completedTasks.get(1).getId());
    }
}