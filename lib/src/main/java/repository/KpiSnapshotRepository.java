package repository;

import model.AppUser;
import model.KpiSnapshot;
import model.Sprint;
import model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KpiSnapshotRepository extends JpaRepository<KpiSnapshot, Long> {
    List<KpiSnapshot> findBySprint(Sprint sprint);
    List<KpiSnapshot> findByTeam(Team team);
    List<KpiSnapshot> findByUser(AppUser user);

    @Query("SELECT k FROM KpiSnapshot k WHERE k.team = :team AND k.user IS NULL")
    List<KpiSnapshot> findTeamWideMetrics(@Param("team") Team team);

    @Query("""
    SELECT k
    FROM   KpiSnapshot k
    WHERE  k.user = :user
      AND  k.team = :team
      AND  (k.kpiType, k.recordedAt) IN (
          SELECT k2.kpiType, MAX(k2.recordedAt)
          FROM   KpiSnapshot k2
          WHERE  k2.user = :user AND k2.team = :team
          GROUP BY k2.kpiType
      )
    """)
    List<KpiSnapshot> findLatestByUserAndTeam(@Param("user") AppUser user,
                                              @Param("team") Team team);
}

