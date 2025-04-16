package repository;

import model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    Optional<Team> findByTeamName(String teamName);

    @Query("""
    SELECT t
    FROM Team t
    JOIN t.projects p
    WHERE p.id = :projectId
    """)
    Optional<Team> findTeamByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT t FROM Team t WHERE t.manager.id = :managerId")
    List<Team> findByManagerId(@Param("managerId") Long managerId);

    @Query("SELECT t FROM Team t WHERE t.isActive = true")
    List<Team> findAllActiveTeams();

    @Query("""
        SELECT DISTINCT t
        FROM Team t
        JOIN t.members m
        WHERE m.id = :developerId
    """)
    List<Team> findByMembersId(@Param("developerId") Long developerId);
}
