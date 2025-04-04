package iuh.fit.se.payment_service.repository;

import iuh.fit.se.payment_service.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findById(Long id);
    Optional<Payment> findByTransactionId(String transactionId);
}
