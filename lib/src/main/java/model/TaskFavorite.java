package model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "task_favorites")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskFavorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Column(name = "favorited_at", nullable = false)
    private LocalDateTime favoritedAt;

    @PrePersist
    protected void onCreate() {
        this.favoritedAt = LocalDateTime.now();
    }
}