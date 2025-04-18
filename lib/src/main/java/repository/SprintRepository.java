package repository;

import model.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> {
    List<Sprint> findByProjectId(Long projectId);
    List<Sprint> findByProjectIdIn(List<Long> projectIds);
    List<Sprint> findByProject_Id(Long projectId);
    List<Sprint> findByProject_Team_Id(Long teamId);
}
