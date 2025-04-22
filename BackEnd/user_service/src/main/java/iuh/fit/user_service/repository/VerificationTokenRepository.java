package iuh.fit.user_service.repository;

import iuh.fit.user_service.model.User;
import iuh.fit.user_service.model.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByUser(User user);
    Optional<VerificationToken> findByOtp(String otp);
}
