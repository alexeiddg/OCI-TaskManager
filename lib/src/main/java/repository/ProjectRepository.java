package repository;

import model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT p FROM Project p WHERE p.manager.id = :managerId")
    List<Project> findAllByManagerId(@Param("managerId") Long managerId);

    @Query("""
           SELECT DISTINCT p
           FROM Project p
           JOIN p.team t
           JOIN t.members m
           WHERE m.id = :developerId
           """)
    List<Project> findAllByDeveloperId(@Param("developerId") Long developerId);

    @Query("SELECT p FROM Project p JOIN p.team t WHERE t.id = :teamId")
    Optional<Project> findByTeamsId(@Param("teamId") Long teamId);

    List<Project> findAllByTeamId(Long teamId);
}
