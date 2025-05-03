package iuh.fit.se.payment_service.service.impl;

import iuh.fit.se.payment_service.dto.PaymentResponseDTO;
import iuh.fit.se.payment_service.dto.RevenueDTO;
import iuh.fit.se.payment_service.dto.StatisticDTO;
import iuh.fit.se.payment_service.entity.Payment;
import iuh.fit.se.payment_service.entity.PaymentMethod;
import iuh.fit.se.payment_service.repository.PaymentMethodRepository;
import iuh.fit.se.payment_service.repository.PaymentRepository;
import iuh.fit.se.payment_service.service.PaymentService;
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
import jakarta.persistence.criteria.Predicate;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final PaymentMethodRepository paymentMethodRepository;

    @Override
    public Page<PaymentResponseDTO> searchPayments(Optional<String> status, Optional<Long> methodId, Optional<Long> userId,
                                                   Optional<LocalDate> from, Optional<LocalDate> to, Pageable pageable) {
        Specification<Payment> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            status.ifPresent(s -> predicates.add(cb.equal(root.get("status"), s)));
            methodId.ifPresent(id -> predicates.add(cb.equal(root.get("paymentMethod").get("id"), id)));
            userId.ifPresent(uid -> predicates.add(cb.equal(root.get("userId"), uid)));
            from.ifPresent(f -> predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), f.atStartOfDay())));
            to.ifPresent(t -> predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), t.atTime(23, 59, 59))));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return paymentRepository.findAll(spec, pageable).map(this::toDTO);
    }

    @Override
    public PaymentResponseDTO getById(Long id) {
        return toDTO(paymentRepository.findById(id).orElseThrow());
    }

    @Override
    public void deleteById(Long id) {
        paymentRepository.deleteById(id);
    }

    @Override
    public RevenueDTO getRevenueStats(Optional<LocalDate> from, Optional<LocalDate> to) {
        List<Payment> payments = paymentRepository.findAll();
        double total = payments.stream().mapToDouble(payment -> payment.getAmount().doubleValue()).sum();
        return new RevenueDTO(total, (long) payments.size());
    }

    @Override
    public StatisticDTO getStatsSummary() {
        List<Payment> payments = paymentRepository.findAll();
        double total = payments.stream().mapToDouble(payment -> payment.getAmount().doubleValue()).sum();
        return new StatisticDTO((long) payments.size(), 0L, new java.math.BigDecimal(total));
    }

    @Override
    public void create(PaymentResponseDTO dto) {
        Payment payment = new Payment();
        payment.setAmount(dto.getAmount());
        payment.setStatus(dto.getStatus() != null ? dto.getStatus() : "PENDING");
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUserId(dto.getUserId());
        payment.setBookingId(dto.getBookingId());
        // Lấy PaymentMethod bằng methodId
        if (dto.getMethodId() != null) {
            PaymentMethod paymentMethod = paymentMethodRepository.findById(dto.getMethodId())
                    .orElseThrow(() -> new IllegalArgumentException("ID phương thức thanh toán không hợp lệ: " + dto.getMethodId()));
            payment.setPaymentMethod(paymentMethod);
        }

        paymentRepository.save(payment);
    }

    @Override
    public void update(Long id, PaymentResponseDTO dto) {
        // Tìm Payment theo id
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));

        // Cập nhật các thông tin thanh toán từ DTO
        payment.setAmount(dto.getAmount());
        payment.setStatus(dto.getStatus());  // Cập nhật trạng thái thanh toán
        payment.setPaymentMethod(paymentMethodRepository.findById(dto.getMethodId())
                .orElseThrow(() -> new RuntimeException("Payment method not found")));  // Cập nhật PaymentMethod
        payment.setUserId(dto.getUserId());  // Cập nhật userId
        payment.setCreatedAt(dto.getCreatedAt());  // Cập nhật thời gian tạo thanh toán (nếu cần)
        payment.setBookingId(dto.getBookingId());
        // Lưu Payment đã cập nhật vào cơ sở dữ liệu
        paymentRepository.save(payment);
    }

    private PaymentResponseDTO toDTO(Payment p) {
        PaymentResponseDTO dto = new PaymentResponseDTO();
        dto.setId(p.getId());
        dto.setAmount(p.getAmount());
        dto.setStatus(p.getStatus());
        dto.setMethodId(p.getPaymentMethod().getId());
        dto.setCreatedAt(p.getCreatedAt());
        dto.setUserId(p.getUserId());
        dto.setBookingId(p.getBookingId());
        return dto;
    }
}