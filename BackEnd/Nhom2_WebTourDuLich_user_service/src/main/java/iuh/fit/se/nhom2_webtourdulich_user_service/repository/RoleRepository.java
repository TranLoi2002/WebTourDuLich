package iuh.fit.se.nhom2_webtourdulich_user_service.repository;

import iuh.fit.se.nhom2_webtourdulich_user_service.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(String name);
}
