package iuh.fit.se.payment_service.controller;

import iuh.fit.se.payment_service.dto.PaymentResponseDTO;
import iuh.fit.se.payment_service.dto.RevenueDTO;
import iuh.fit.se.payment_service.dto.StatisticDTO;
import iuh.fit.se.payment_service.entity.Payment;
import iuh.fit.se.payment_service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/admin/payments")
@RequiredArgsConstructor
public class PaymentControler {
    private final PaymentService paymentService;

    @GetMapping
    public Page<PaymentResponseDTO> searchPayments(
            @RequestParam Optional<String> status,
            @RequestParam Optional<Long> methodId,
            @RequestParam Optional<Long> userId,
            @RequestParam Optional<LocalDate> from,
            @RequestParam Optional<LocalDate> to,
            Pageable pageable) {
        return paymentService.searchPayments(status, methodId, userId, from, to, pageable);
    }

    @GetMapping("/{id}")
    public PaymentResponseDTO get(@PathVariable Long id) {
        return paymentService.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        paymentService.deleteById(id);
    }

    @GetMapping("/revenue")
    public RevenueDTO getRevenueStats(@RequestParam Optional<LocalDate> from, @RequestParam Optional<LocalDate> to) {
        return paymentService.getRevenueStats(from, to);
    }

    @GetMapping("/stats")
    public StatisticDTO getStatsSummary() {
        return paymentService.getStatsSummary();
    }
}
