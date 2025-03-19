package iuh.fit.se.nhom2_webtourdulich_user_service.repository;

import iuh.fit.se.nhom2_webtourdulich_user_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

}
