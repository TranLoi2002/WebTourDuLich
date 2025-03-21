package iuh.fit.se.nhom2_webtourdulich_payment_service.repository;

import iuh.fit.se.nhom2_webtourdulich_payment_service.model.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
}