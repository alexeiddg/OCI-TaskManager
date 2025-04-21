package repository;

import model.AppUser;
import model.KpiSnapshot;
import model.Sprint;
import model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KpiSnapshotRepository extends JpaRepository<KpiSnapshot, Long> {
    List<KpiSnapshot> findBySprint(Sprint sprint);
    List<KpiSnapshot> findByTeam(Team team);
    List<KpiSnapshot> findByUser(AppUser user);
}
