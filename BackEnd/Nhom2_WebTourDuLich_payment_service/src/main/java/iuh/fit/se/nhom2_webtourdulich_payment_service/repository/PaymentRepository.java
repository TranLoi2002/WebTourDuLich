package iuh.fit.se.nhom2_webtourdulich_payment_service.repository;

import iuh.fit.se.nhom2_webtourdulich_payment_service.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
