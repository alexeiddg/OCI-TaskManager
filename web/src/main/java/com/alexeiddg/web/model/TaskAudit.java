package com.alexeiddg.web.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "task_audit")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long auditId;

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne
    @JoinColumn(name = "changed_by", nullable = false)
    private AppUser changedBy;

    @Column(name = "old_status", length = 20)
    private String oldStatus;

    @Column(name = "new_status", length = 20)
    private String newStatus;

    @Column(name = "change_type", length = 20)
    private String changeType;

    @Column(name = "change_comment", length = 2000)
    private String changeComment;

    @Column(name = "changed_at", nullable = false)
    private OffsetDateTime changedAt;
}