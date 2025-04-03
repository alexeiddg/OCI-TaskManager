package com.alexeiddg.web.model;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "task_metrics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "metric_id")
    private Long metricId;

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false, foreignKey = @ForeignKey(name = "fk_metrics_team"))
    private Team team;

    @ManyToOne
    @JoinColumn(name = "sprint_id", foreignKey = @ForeignKey(name = "fk_metrics_sprint"))
    private Sprint sprint;

    @ManyToOne
    @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "fk_metrics_project"))
    private Project project;

    @ManyToOne
    @JoinColumn(name = "developer_id", foreignKey = @ForeignKey(name = "fk_metrics_developer"))
    private AppUser developer;

    @Column(name = "total_assigned_tasks", columnDefinition = "INT DEFAULT 0")
    private int totalAssignedTasks;

    @Column(name = "completed_tasks", columnDefinition = "INT DEFAULT 0")
    private int completedTasks;

    @Column(name = "avg_completion_time", columnDefinition = "INTERVAL DAY TO SECOND")
    private Long avgCompletionTime;

    @Column(name = "bugs_fixed", columnDefinition = "INT DEFAULT 0")
    private int bugsFixed;

    @Column(name = "features_completed", columnDefinition = "INT DEFAULT 0")
    private int featuresCompleted;

    @Column(name = "sprint_completion_rate", columnDefinition = "FLOAT DEFAULT 0.0")
    private float sprintCompletionRate;

    @Column(name = "efficiency_score", columnDefinition = "FLOAT DEFAULT 0.0")
    private float efficiencyScore;
}