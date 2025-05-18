package iuh.fit.se.payment_service.service.impl;

import iuh.fit.se.payment_service.dto.RefundResponseDTO;
import iuh.fit.se.payment_service.entity.Payment;
import iuh.fit.se.payment_service.entity.Refund;
import iuh.fit.se.payment_service.repository.PaymentRepository;
import iuh.fit.se.payment_service.repository.RefundRepository;
import iuh.fit.se.payment_service.service.RefundService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;

@Service
@RequiredArgsConstructor
public class RefundServiceImpl implements RefundService {
    private final RefundRepository refundRepository;
    private final PaymentRepository paymentRepository;

    @Override
    public Page<RefundResponseDTO> getRefundsByDateRange(
            Optional<Long> paymentId, Optional<String> status, Optional<LocalDate> from, Optional<LocalDate> to, Pageable pageable) {

        Specification<Refund> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

            // Lọc theo paymentId
            paymentId.ifPresent(id -> predicates.add(cb.equal(root.get("payment").get("id"), id)));

            // Lọc theo status
            status.ifPresent(st -> predicates.add(cb.equal(root.get("status"), st)));

            // Lọc theo khoảng thời gian createdAt
            from.ifPresent(f -> predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), f.atStartOfDay())));
            to.ifPresent(t -> predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), t.atTime(23, 59, 59))));

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        return refundRepository.findAll(spec, pageable).map(this::toDTO);
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

    @Override
    public void create(RefundResponseDTO dto) {
        // Kiểm tra Payment có tồn tại không
        Payment payment = paymentRepository.findById(dto.getPaymentId())
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + dto.getPaymentId()));

        // Tạo Refund mới
        Refund refund = new Refund();
        refund.setPayment(payment);  // Liên kết với Payment
        refund.setStatus("INITIATED");  // Mặc định trạng thái là PENDING
        refund.setReason(dto.getReason());  // Đặt lý do từ DTO
        refund.setCreatedAt(LocalDateTime.now());  // Đặt thời gian tạo Refund

        // Lưu Refund vào cơ sở dữ liệu
        refundRepository.save(refund);
    }

    @Override
    public void update(Long id, RefundResponseDTO dto) {
        // Tìm Refund theo id
        Refund refund = refundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Refund not found with id: " + id));

        // Cập nhật các thông tin Refund từ DTO
        refund.setStatus(dto.getStatus());  // Cập nhật trạng thái Refund
        refund.setReason(dto.getReason());  // Cập nhật lý do
        refund.setCreatedAt(dto.getCreatedAt());  // Cập nhật thời gian tạo (nếu cần)

        // Lưu Refund đã cập nhật vào cơ sở dữ liệu
        refundRepository.save(refund);
    }

    private RefundResponseDTO toDTO(Refund r) {
        RefundResponseDTO dto = new RefundResponseDTO();
        dto.setId(r.getId());
        dto.setPaymentId(r.getPayment().getId());
        dto.setStatus(r.getStatus());
        dto.setReason(r.getReason());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setBookingId(r.getPayment().getBookingId());
        return dto;
    }

}
