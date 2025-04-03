package com.alexeiddg.web.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taskId;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(name = "sprint_id")
    private Sprint sprint;

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "priority", length = 20)
    private String priority;

    @Column(name = "status", length = 20, columnDefinition = "varchar(20) default 'PENDING'")
    private String status;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private AppUser createdBy;

    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private AppUser assignedTo;

    @Column(name = "task_type", nullable = false, length = 50)
    private String taskType;

    @Column(name = "story_points", columnDefinition = "int default 1")
    private int storyPoints;

    @Column(name = "time_in_progress")
    private Long timeInProgress;

    @Column(name = "blocked", columnDefinition = "boolean default false")
    private boolean blocked;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}