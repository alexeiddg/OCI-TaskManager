package com.alexeiddg.telegram.bot.actions.reports;

import DTO.domian.kpi.ProgressForecast;
import DTO.domian.kpi.TaskTypeBreakdown;
import DTO.domian.kpi.TeamProgressForecast;
import DTO.domian.kpi.TeamTaskTypeBreakdown;
import com.alexeiddg.telegram.bot.session.UserSessionManager;
import com.alexeiddg.telegram.bot.session.UserState;
import com.alexeiddg.telegram.bot.util.ReplyKeyboard;
import com.alexeiddg.telegram.service.*;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import model.KpiSnapshot;
import model.Sprint;
import org.springframework.stereotype.Component;
import org.telegram.abilitybots.api.bot.BaseAbilityBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import repository.KpiSnapshotRepository;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ReportsAbility {

    private final UserSessionManager userSessionManager;
    private final AppUserService appUserService;
    private final SprintService sprintService;
    private final KpiSnapshotRepository kpiSnapshotRepository;
    private final KpiCalculationService kpiCalculationService;
    private final TeamKpiCalculationService teamKpi;

    public void ReportsMenu(BaseAbilityBot bot, Long chatId, Long telegramId) {
        userSessionManager.setState(telegramId, UserState.REPORTS_MENU);
        SendMessage msg = new SendMessage();
        msg.setChatId(chatId.toString());
        msg.setText("Please select a report type from the menu:");
        msg.setReplyMarkup(ReplyKeyboard.generateKeyboardForState(UserState.REPORTS_MENU));
        execute(bot, msg);
    }

    public void showPersonalReport(BaseAbilityBot bot, Long chatId, Long telegramId) {
        AppUser user = appUserService
                .getUserByTelegramIdWithTeamAndMembers(telegramId.toString())
                .orElse(null);

        if (user == null) {
            bot.silent().send("⚠️ User not found.", chatId);
            return;
        }

        Sprint sprint = sprintService
                .findLatestSprintWithAllRelations(user.getTeam().getId())
                .orElse(null);

        if (sprint == null) {
            bot.silent().send("⚠️ No active sprint found for your team.", chatId);
            return;
        }

        int velocity = (int) kpiCalculationService.calculateSprintVelocity(sprint);
        double completionRate = kpiCalculationService.calculateSprintCompletionRate(sprint) * 100;
        double spPerHour = kpiCalculationService.calculateEfficiency(user, sprint);
        double avgLogged = kpiCalculationService.calculateAverageLoggedHours(user, sprint);
        double estAccuracy = kpiCalculationService.estimateErrorPct(user, sprint);
        double bugFeatureRatio = kpiCalculationService.calculateBugsVsFeatures(sprint);
        double focusScore = kpiCalculationService.calculateFocusScore(user, sprint);
        long blockedCount = kpiCalculationService.countBlockedTasks(user);
        long highPriorityPending = kpiCalculationService.countHighPriorityPending(user);
        long overdueTasks = kpiCalculationService.countOverdueTasks(user);
        boolean scopeAtRisk = kpiCalculationService.isSprintScopeAtRisk(user, sprint);
        TaskTypeBreakdown typeBreakdown = kpiCalculationService.getTaskTypeBreakdown(user, sprint);
        ProgressForecast forecast = kpiCalculationService.getProgressForecast(user, sprint);

        String report =
                "📊 *Your Personal Sprint KPIs*\n\n" +
                        "📈 *Velocity:* " + velocity + " SP\n" +
                        "Number of story points you completed during this sprint.\n" +

                        "\n✅ *Completion Rate:* " + Math.round(completionRate) + "%\n" +
                        "Percentage of your assigned sprint tasks that you finished.\n" +

                        "\n⚙️ *Efficiency:* " + String.format("%.2f", spPerHour) + " SP/h\n" +
                        "How many story points you delivered per hour logged (higher = more efficient).\n" +

                        "\n📉 *Estimate Error:* " + String.format("%.2f", estAccuracy) + "%%\n" +
                        "Percentage difference between estimated effort (SP) and actual hours logged.\n" +
                        "Lower values mean better estimation accuracy.\n"+

                        "\n🧮 *Avg Logged Hours:* " + String.format("%.2f", avgLogged) + " h/task\n" +
                        "Your average hours logged per completed task.\n" +

                        "\n🪲 *Bug:Feature Ratio:* " + String.format("%.2f", bugFeatureRatio) + "\n" +
                        "Number of bugs completed for each feature completed (lower is better).\n" +

                        "\n🧠 *Focus Score:* " + Math.round(focusScore * 100) + "%\n" +
                        "Portion of your completed tasks that are feature-related (value delivery).\n"+

                        "\n───────────────\n" +
                        "🚨 *Risk & Blocker Indicators*\n\n" +

                        "🧱 *Blocked Tasks:* " + blockedCount + "\n" +
                        "Tasks currently marked as blocked.\n" +

                        "\n🔥 *High Priority Pending:* " + highPriorityPending + "\n" +
                        "High-priority tasks still in progress or not started.\n" +

                        "\n⏳ *Overdue Tasks:* " + overdueTasks + "\n" +
                        "Tasks past their due date that haven’t been completed.\n" +

                        "\n⚠️ *Sprint Scope at Risk:* " + (scopeAtRisk ? "Yes" : "No") + "\n" +
                        "Remaining workload might exceed your current pace before sprint ends."+

                        "\n───────────────\n" +
                        "💡 *Contextual Metrics & Insights*\n\n" +

                        "📊 *Task Type Distribution:*\n" +
                        "• BUG: " + typeBreakdown.bugs() + "\n" +
                        "• FEATURE: " + typeBreakdown.features() + "\n" +
                        "• IMPROVEMENT: " + typeBreakdown.improvements() + "\n" +
                        "Breakdown of your assigned tasks by type.\n" +

                        "\n📈 *Progress Forecast:*\n" +
                        "• Time Elapsed: " + Math.round(forecast.timeElapsedPct()) + "%\n" +
                        "• Work Completed: " + Math.round(forecast.taskCompletionPct()) + "%\n" +
                        "How much time has passed vs how much of your work is done.";

        SendMessage msg = new SendMessage(chatId.toString(), report);
        msg.setParseMode("Markdown");
        execute(bot, msg);
    }

    public void showTeamReport(BaseAbilityBot bot, Long chatId, Long telegramId) {
        AppUser user = appUserService
                .getUserByTelegramIdWithTeamAndMembers(String.valueOf(telegramId))
                .orElse(null);
        if (user == null || user.getTeam() == null) {
            bot.silent().send("⚠️ Team not found.", chatId);
            return;
        }

        Sprint sprint = sprintService
                .findLatestSprintWithAllRelations(user.getTeam().getId())
                .orElse(null);
        if (sprint == null) {
            bot.silent().send("⚠️ No active sprint for your team.", chatId);
            return;
        }

        // ─── core team KPIs ───────────────────────────────────────────────
        int    teamVelocity      = teamKpi.sprintVelocity(sprint);
        double completionRate    = teamKpi.completionRate(sprint) * 100;
        double avgEfficiency     = teamKpi.averageEfficiency(sprint);
        double avgCompletionTime = teamKpi.averageCompletionTime(sprint);
        double bugFeatRatio      = teamKpi.bugFeatureRatio(sprint);
        double workloadBalance   = teamKpi.workloadBalance(sprint);

        // ─── risk & blockers ──────────────────────────────────────────────
        long   blockedCount      = teamKpi.blockedTasks(sprint);
        long   highPrioPending   = teamKpi.highPriorityPending(sprint);
        long   overdueCount      = teamKpi.overdueTasks(sprint);
        boolean scopeAtRisk      = teamKpi.scopeAtRisk(sprint);

        // ─── contextual insights ──────────────────────────────────────────
        double totalHoursLogged  = teamKpi.totalTimeLogged(sprint);
        TeamTaskTypeBreakdown typeBreakdown = teamKpi.taskTypeBreakdown(sprint);
        TeamProgressForecast progress = teamKpi.progressForecast(sprint);

        // ─── advanced metrics ─────────────────────────────────────────────
        double focusScore        = teamKpi.focusScore(sprint) * 100;
        List<AppUser> topContrib = teamKpi.topContributors(sprint);

        StringBuilder rpt = new StringBuilder("👥 *Team Sprint KPI Summary*\n\n");

        rpt.append("✅ *Core Team KPIs*\n\n")
                .append("📈 *Team Velocity:* ").append(teamVelocity).append(" SP\n")
                .append("Total story points completed by the team this sprint.\n\n")

                .append("✅ *Team Completion Rate:* ").append(Math.round(completionRate)).append("%\n")
                .append("Percentage of all active sprint tasks completed.\n\n")

                .append("⚙️ *Avg Efficiency:* ").append(String.format("%.2f", avgEfficiency)).append(" SP/h\n")
                .append("Average SP completed per hour logged, across the team.\n\n")

                .append("📅 *Total Time Logged:* ").append(String.format("%.2f", totalHoursLogged)).append(" hrs\n")
                .append("Hours the team has logged this sprint.\n\n")

                .append("🪲 *Bug:Feature Ratio:* ").append(String.format("%.2f", bugFeatRatio)).append("\n")
                .append("Number of bugs completed per feature delivered.\n\n")

                .append("📦 *Workload Balance:* ").append(String.format("%.2f", workloadBalance)).append(" (1 = perfect)\n")
                .append("Balance of story point distribution across members.\n\n")

                .append("───────────────\n")
                .append("🚨 *Risk & Blocker Indicators*\n\n")
                .append("🧱 *Blocked Tasks:* ").append(blockedCount).append("\n")
                .append("Currently blocked tasks in the sprint.\n\n")

                .append("🔥 *High Priority Pending:* ").append(highPrioPending).append("\n")
                .append("High‑priority tasks not yet completed.\n\n")

                .append("⏳ *Overdue Tasks:* ").append(overdueCount).append("\n")
                .append("Tasks past their due date and still open.\n\n")

                .append("⚠️ *Scope at Risk:* ").append(scopeAtRisk ? "Yes" : "No").append("\n")
                .append("Team likely to miss sprint scope at current pace.\n\n")

                .append("───────────────\n")
                .append("💡 *Contextual Insights*\n\n")
                .append("📊 *Task Type Distribution:*\n")
                .append("• BUG: ").append(typeBreakdown.bugs()).append("\n")
                .append("• FEATURE: ").append(typeBreakdown.features()).append("\n")
                .append("• IMPROVEMENT: ").append(typeBreakdown.improvements()).append("\n")
                .append("Breakdown of tasks by type.\n\n")

                .append("📈 *Progress Forecast:*\n")
                .append("• Time Passed: ").append(Math.round(progress.timePercent())).append("%\n")
                .append("• Work Done: ").append(Math.round(progress.workPercent())).append("%\n")
                .append("Sprint progress compared to elapsed time.\n\n")

                .append("───────────────\n")
                .append("🧠 *Advanced Metrics*\n\n")
                .append("🧠 *Focus Score:* ").append(String.format("%.2f", focusScore)).append("%\n")
                .append("Share of feature work in completed tasks.\n\n")

                .append("🌟 *Top Contributor(s):*\n");
                topContrib.forEach(m -> rpt.append("• ").append(m.getName()).append("\n")
        );
        rpt.append("Based on sprint velocity (SP completed).");

        SendMessage msg = new SendMessage(chatId.toString(), rpt.toString());
        msg.setParseMode("Markdown");
        execute(bot, msg);
    }

    private void execute(BaseAbilityBot bot, SendMessage msg) {
        try {
            bot.execute(msg);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
