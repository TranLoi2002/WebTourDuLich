package iuh.fit.se.payment_service.service;

import iuh.fit.se.payment_service.dto.PaymentResponseDTO;
import iuh.fit.se.payment_service.dto.RefundResponseDTO;
import iuh.fit.se.payment_service.entity.Refund;
import iuh.fit.se.payment_service.repository.RefundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public interface RefundService {
    Page<RefundResponseDTO> getRefundsByDateRange(
            Optional<Long> paymentId,
            Optional<String> status,
            Optional<LocalDate> from,
            Optional<LocalDate> to,
            Pageable pageable);
    void approveRefund(Long id);
    void rejectRefund(Long id, String reason);
    void create(RefundResponseDTO dto);
    void update(Long id, RefundResponseDTO dto);
}