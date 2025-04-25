package iuh.fit.se.payment_service.service;

import iuh.fit.se.payment_service.dto.PaymentResponseDTO;
import iuh.fit.se.payment_service.dto.RevenueDTO;
import iuh.fit.se.payment_service.dto.StatisticDTO;
import iuh.fit.se.payment_service.entity.Payment;
import iuh.fit.se.payment_service.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public interface PaymentService {
    Page<PaymentResponseDTO> searchPayments(Optional<String> status, Optional<Long> methodId, Optional<Long> userId,
                                            Optional<LocalDate> from, Optional<LocalDate> to, Pageable pageable);
    PaymentResponseDTO getById(Long id);
    void deleteById(Long id);
    RevenueDTO getRevenueStats(Optional<LocalDate> from, Optional<LocalDate> to);
    StatisticDTO getStatsSummary();
    void create(Payment payment);
    void update(Long id, Payment payment);
}
