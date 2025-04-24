package com.alexeiddg.web.controller.task;

import DTO.domian.TaskLogDto;
import DTO.setup.CreateTaskLogRequest;
import com.alexeiddg.web.service.TaskLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task-logs")
public class TaskLogController {

    private final TaskLogService logService;

    public TaskLogController(TaskLogService logService) {
        this.logService = logService;
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<List<TaskLogDto>> getLogs(
            @PathVariable("taskId") Long taskId,
            @RequestParam("userId") Long userId
    ) {
        List<TaskLogDto> logs = logService.getLogsForTaskAndUser(taskId, userId);
        return ResponseEntity.ok(logs);
    }

    @PostMapping("/{taskId}")
    public ResponseEntity<TaskLogDto> addLog(
            @PathVariable("taskId") Long taskId,
            @RequestBody CreateTaskLogRequest req
    ) {
        if (!taskId.equals(req.taskId())) {
            return ResponseEntity.badRequest().build();
        }
        TaskLogDto created = logService.addLog(taskId, req);
        return ResponseEntity.ok(created);
    }
}
