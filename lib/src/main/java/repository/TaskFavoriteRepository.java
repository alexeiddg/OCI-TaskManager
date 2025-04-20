package repository;

import model.TaskFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskFavoriteRepository extends JpaRepository<TaskFavorite, Long> {
    Optional<TaskFavorite> findByUserIdAndTaskId(Long userId, Long taskId);
    void deleteByUserIdAndTaskId(Long userId, Long taskId);
    List<TaskFavorite> findAllByUserId(Long userId);
    boolean existsByTaskIdAndUserId(Long taskId, Long userId);
}
