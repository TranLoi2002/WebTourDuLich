package iuh.fit.se.payment_service.repository;

import iuh.fit.se.payment_service.entity.Refund;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {
    Page<Refund> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to, Pageable pageable);
}
