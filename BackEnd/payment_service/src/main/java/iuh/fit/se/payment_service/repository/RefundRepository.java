package iuh.fit.se.payment_service.repository;

import iuh.fit.se.payment_service.entity.Refund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {
    Optional<Refund> findById(Long id);
    Optional<Refund> findByPaymentId(Long paymentId);
}
