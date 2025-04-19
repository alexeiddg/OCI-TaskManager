package repository;

import model.ProjectFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectFavoriteRepository extends JpaRepository<ProjectFavorite, Long> {

    boolean existsByProjectIdAndUserId(Long projectId, Long userId);

    List<ProjectFavorite> findByUserId(Long userId);
}
