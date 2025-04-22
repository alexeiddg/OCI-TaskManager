package repository;

import model.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> {
    List<Sprint> findByProjectId(Long projectId);
    List<Sprint> findByProjectIdIn(List<Long> projectIds);
    List<Sprint> findByProject_Id(Long projectId);
    List<Sprint> findByProject_Team_Id(Long teamId);
    List<Sprint> findByProjectIdAndIsActiveTrue(Long projectId);

    @Query("SELECT s FROM Sprint s WHERE s.project.team.id = :teamId AND s.isActive = true ORDER BY s.endDate DESC")
    List<Sprint> findLatestActiveSprintByTeamId(@Param("teamId") Long teamId);

    @Query("""
    SELECT s FROM Sprint s
    JOIN FETCH s.tasks
    WHERE s.project.team.id = :teamId
    AND s.isActive = true
    ORDER BY s.endDate DESC
    LIMIT 1
    """)
    Optional<Sprint> findLatestWithTasksByTeamId(@Param("teamId") Long teamId);

    @Query("""
    SELECT s FROM Sprint s
    JOIN FETCH s.project p
    JOIN FETCH p.team t
    LEFT JOIN FETCH t.members
    JOIN FETCH s.tasks
    WHERE t.id = :teamId
    AND s.isActive = true
    ORDER BY s.endDate DESC
    LIMIT 1
""")
    Optional<Sprint> findLatestSprintWithAllRelations(@Param("teamId") Long teamId);
}
