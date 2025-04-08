package iuh.fit.se.payment_service.service.impl;

import iuh.fit.se.payment_service.dto.PaymentResponseDTO;
import iuh.fit.se.payment_service.dto.RevenueDTO;
import iuh.fit.se.payment_service.dto.StatisticDTO;
import iuh.fit.se.payment_service.entity.Payment;
import iuh.fit.se.payment_service.repository.PaymentRepository;
import iuh.fit.se.payment_service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import jakarta.persistence.criteria.Predicate;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;

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
        BigDecimal total = payments.stream().map(Payment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new RevenueDTO(total, (long) payments.size());
    }

    @Override
    public StatisticDTO getStatsSummary() {
        List<Payment> payments = paymentRepository.findAll();
        BigDecimal total = payments.stream().map(Payment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new StatisticDTO((long) payments.size(), 0L, total);
    }

    private PaymentResponseDTO toDTO(Payment p) {
        PaymentResponseDTO dto = new PaymentResponseDTO();
        dto.setId(p.getId());
        dto.setAmount(p.getAmount());
        dto.setStatus(p.getStatus());
        dto.setMethodName(p.getPaymentMethod().getName());
        dto.setCreatedAt(p.getCreatedAt());
        dto.setUserId(p.getUserId());
        return dto;
    }

}
