package com.alexeiddg.web.repository;

import com.alexeiddg.web.model.AppUser;
import com.alexeiddg.web.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
@EnableTransactionManagement
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT p FROM Project p JOIN p.developers d WHERE d = :developer")
    List<Project> findByDevelopersContaining(AppUser developer);

    // Fetch projects where the user is either the manager or a developer
    @Query("SELECT p FROM Project p WHERE p.manager = :user OR :user MEMBER OF p.developers")
    List<Project> findByUser(AppUser user);

    List<Project> findByManager(AppUser manager);
}
