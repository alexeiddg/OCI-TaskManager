package repository;

import enums.UserRole;
import model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByUsername(String username);
    Optional<AppUser> findByTelegramId(String telegramId);
    Optional<AppUser> findByEmail(String email);
    List<AppUser> findAllByRole(UserRole role);
    List<AppUser> findByTeamIdAndRole(Long teamId, UserRole role);
    boolean existsByIdAndTeamIsNotNull(Long userId);
    List<AppUser> findByTeamId(Long teamId);
}
