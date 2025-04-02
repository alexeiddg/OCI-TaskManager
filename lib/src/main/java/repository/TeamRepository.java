package repository;

import model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    @Query("SELECT t FROM Team t WHERE t.project.id = :projectId")
    List<Team> findByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT t FROM Team t WHERE t.manager.id = :managerId")
    List<Team> findByManagerId(@Param("managerId") Long managerId);

    @Query("""
        SELECT DISTINCT t
        FROM Team t
        JOIN t.members m
        WHERE m.id = :developerId
    """)
    List<Team> findByMembersId(@Param("developerId") Long developerId);
}
