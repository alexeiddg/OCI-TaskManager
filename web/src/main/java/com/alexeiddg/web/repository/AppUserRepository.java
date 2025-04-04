package com.alexeiddg.web.repository;

import com.alexeiddg.web.model.AppUser;
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
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByUsername(String username);
    List<AppUser> findByRole(String role);

    @Query("SELECT u FROM AppUser u WHERE u.userId NOT IN (SELECT p.manager.userId FROM Project p) " +
            "AND u.userId NOT IN (SELECT d.userId FROM Project p JOIN p.developers d)")
    List<AppUser> findUsersWithoutProjects();
}
