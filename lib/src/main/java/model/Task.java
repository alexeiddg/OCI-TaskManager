package model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import enums.TaskPriority;
import enums.TaskStatus;
import enums.TaskType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "sprint_id", nullable = false)
    @JsonBackReference
    private Sprint sprint;

    @Column(name = "task_name", nullable = false, length = 100)
    private String taskName;

    @Column(name = "task_description", nullable = false, columnDefinition = "TEXT")
    private String taskDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false, length = 20)
    private TaskPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private TaskType type;

    @Column(name = "story_points", nullable = false)
    private int storyPoints;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private AppUser createdBy;

    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private AppUser assignedTo;

    @Column(name = "blocked", nullable = false)
    private boolean blocked = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Transient
    public boolean isBug() {
        return type == TaskType.BUG;
    }

    @Transient
    public boolean isFeature() {
        return type == TaskType.FEATURE;
    }

    @Transient
    public boolean wasCompletedOnTime() {
        return completedAt != null && dueDate != null && !completedAt.isAfter(dueDate);
    }

    @Transient
    public boolean isCompleted() {
        return status == TaskStatus.DONE;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
        this.isActive = true;
        this.blocked = false;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

// Revised 3NF compliance