package iuh.fit.se.payment_service.controller;

import iuh.fit.se.payment_service.dto.PaymentMethodDTO;
import iuh.fit.se.payment_service.dto.PaymentResponseDTO;
import iuh.fit.se.payment_service.dto.RevenueDTO;
import iuh.fit.se.payment_service.dto.StatisticDTO;
import iuh.fit.se.payment_service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentControler {
    private final PaymentService paymentService;
    private static final Logger logger = LoggerFactory.getLogger(PaymentControler.class);
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

    @PostMapping
    public void create(@RequestBody PaymentResponseDTO dto) {
        logger.info("Received request to create payment: {}", dto);
        paymentService.create(dto);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable Long id, @RequestBody PaymentResponseDTO dto) {
        paymentService.update(id, dto);
    }

}
