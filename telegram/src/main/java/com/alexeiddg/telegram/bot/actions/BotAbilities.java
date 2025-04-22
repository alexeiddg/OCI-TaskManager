package com.alexeiddg.telegram.bot.actions;

import com.alexeiddg.telegram.bot.actions.project.CreateProjectAbility;
import com.alexeiddg.telegram.bot.actions.project.DeleteProjectAbility;
import com.alexeiddg.telegram.bot.actions.project.ProjectAbility;
import com.alexeiddg.telegram.bot.actions.reports.ReportsAbility;
import com.alexeiddg.telegram.bot.actions.sprint.CreateSprintAbility;
import com.alexeiddg.telegram.bot.actions.sprint.SprintAbility;
import com.alexeiddg.telegram.bot.actions.task.CreateTaskAbility;
import com.alexeiddg.telegram.bot.actions.task.DeleteTaskAbility;
import com.alexeiddg.telegram.bot.actions.task.TaskAbility;
import com.alexeiddg.telegram.bot.actions.task.UpdateTaskAbility;
import org.springframework.stereotype.Component;

@Component
public record BotAbilities(
        StartAbility start,
        SignUpAbility signUp,
        LoginAbility login,
        StopAbility stop,
        ProjectAbility projectAbility,
        CreateProjectAbility createProjectAbility,
        DeleteProjectAbility deleteProjectAbility,
        SprintAbility sprintAbility,
        CreateSprintAbility createSprintAbility,
        TaskAbility taskAbility,
        CreateTaskAbility createTaskAbility,
        DeleteTaskAbility deleteTaskAbility,
        UpdateTaskAbility updateTaskAbility,
        ReportsAbility reportsAbility
) { }
