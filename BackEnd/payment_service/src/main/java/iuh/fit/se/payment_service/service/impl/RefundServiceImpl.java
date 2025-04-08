package iuh.fit.se.payment_service.service.impl;

import iuh.fit.se.payment_service.dto.RefundResponseDTO;
import iuh.fit.se.payment_service.entity.Refund;
import iuh.fit.se.payment_service.repository.PaymentRepository;
import iuh.fit.se.payment_service.repository.RefundRepository;
import iuh.fit.se.payment_service.service.RefundService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RefundServiceImpl implements RefundService {
    private final RefundRepository refundRepository;
    private final PaymentRepository paymentRepository;

    @Override
    public Page<RefundResponseDTO> getRefundsByDateRange(Optional<LocalDate> from, Optional<LocalDate> to, Pageable pageable) {
        LocalDateTime fromDate = from.orElse(LocalDate.of(2000, 1, 1)).atStartOfDay();
        LocalDateTime toDate = to.orElse(LocalDate.now()).atTime(23, 59, 59);
        return refundRepository.findByCreatedAtBetween(fromDate, toDate, pageable).map(this::toDTO);
    }

    @Override
    public void approveRefund(Long id) {
        Refund refund = refundRepository.findById(id).orElseThrow();
        refund.setStatus("APPROVED");
        refundRepository.save(refund);
    }

    @Override
    public void rejectRefund(Long id, String reason) {
        Refund refund = refundRepository.findById(id).orElseThrow();
        refund.setStatus("REJECTED");
        refund.setReason(reason);
        refundRepository.save(refund);
    }

    private RefundResponseDTO toDTO(Refund r) {
        RefundResponseDTO dto = new RefundResponseDTO();
        dto.setId(r.getId());
        dto.setPaymentId(r.getPayment().getId());
        dto.setStatus(r.getStatus());
        dto.setReason(r.getReason());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }

}
