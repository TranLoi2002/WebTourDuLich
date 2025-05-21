package iuh.fit.se.payment_service.controller;

import iuh.fit.se.payment_service.dto.PaymentMethodDTO;
import iuh.fit.se.payment_service.dto.PaymentResponseDTO;
import iuh.fit.se.payment_service.dto.RevenueDTO;
import iuh.fit.se.payment_service.dto.StatisticDTO;
import iuh.fit.se.payment_service.entity.Payment;
import iuh.fit.se.payment_service.repository.PaymentRepository;
import iuh.fit.se.payment_service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/payment/payments")
@RequiredArgsConstructor
public class PaymentControler {
    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;

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
        paymentService.create(dto);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable Long id, @RequestBody PaymentResponseDTO dto) {
        paymentService.update(id, dto);
    }


    // mới thêm

    @PutMapping("/update-cancel-status/{id}")
    public ResponseEntity<Void> updatePaymentToCancel(@PathVariable Long id) {
        Payment p = paymentRepository.findById(id).orElseThrow(()
                -> new IllegalArgumentException("Payment not found"));
        p.setStatus("CANCELLED");
        paymentRepository.save(p);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/update-refund-status/{id}")
    public ResponseEntity<Void> updatePaymentToRefund(@PathVariable Long id) {
        Payment p = paymentRepository.findById(id).orElseThrow(()
                -> new IllegalArgumentException("Payment not found"));
        p.setStatus("INITIATED");
        paymentRepository.save(p);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update-completed-status/{id}")
    public ResponseEntity<Void> updatePaymentToComplete(@PathVariable Long id) {
        Payment p = paymentRepository.findById(id).orElseThrow(()
                -> new IllegalArgumentException("Payment not found"));
        p.setStatus("COMPLETED");
        paymentRepository.save(p);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/update-approve-status/{id}")
    public ResponseEntity<Void> updatePaymentToApprove(@PathVariable Long id) {
        Payment p = paymentRepository.findById(id).orElseThrow(()
                -> new IllegalArgumentException("Payment not found"));
        p.setStatus("APPROVED");
        paymentRepository.save(p);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/update-reject-status/{id}")
    public ResponseEntity<Void> updatePaymentToReject(@PathVariable Long id) {
        Payment p = paymentRepository.findById(id).orElseThrow(()
                -> new IllegalArgumentException("Payment not found"));
        p.setStatus("REJECTED");
        paymentRepository.save(p);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get-payment-by-bookingId")
    public ResponseEntity<Payment> getByBookingId(@RequestParam Long bookingId) {
        Payment p = paymentRepository.findPaymentByBookingId(bookingId);
        if (p == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(p);
    }
}