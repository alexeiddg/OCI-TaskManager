package com.alexeiddg.web.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "sprints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Sprint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sprintId;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "sprint_name", nullable = false, length = 100)
    private String sprintName;

    @Column(name = "start_date", nullable = false)
    private OffsetDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private OffsetDateTime endDate;

    @ManyToMany
    @JoinTable(
            name = "sprint_teams",
            joinColumns = @JoinColumn(name = "sprint_id"),
            inverseJoinColumns = @JoinColumn(name = "team_id")
    )
    private Set<Team> teams = new HashSet<>();

    @Column(name = "total_tasks", nullable = false, columnDefinition = "int default 0")
    private int totalTasks;

    @Column(name = "completed_tasks", nullable = false, columnDefinition = "int default 0")
    private int completedTasks;

    @Column(name = "sprint_velocity", nullable = false, columnDefinition = "float default 0")
    private float sprintVelocity;

    @Column(name = "completion_rate", nullable = false, columnDefinition = "float default 0.0")
    private float completionRate;
}