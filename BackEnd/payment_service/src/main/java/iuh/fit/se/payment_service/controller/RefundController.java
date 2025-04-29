package iuh.fit.se.payment_service.controller;

import iuh.fit.se.payment_service.dto.PaymentResponseDTO;
import iuh.fit.se.payment_service.dto.RefundResponseDTO;
import iuh.fit.se.payment_service.entity.Refund;
import iuh.fit.se.payment_service.service.RefundService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/payment/refunds")
@RequiredArgsConstructor
public class RefundController {
    private final RefundService refundService;

    @GetMapping
    public Page<RefundResponseDTO> getRefunds(@RequestParam Optional<LocalDate> from,
                                              @RequestParam Optional<LocalDate> to,
                                              Pageable pageable) {
        return refundService.getRefundsByDateRange(from, to, pageable);
    }

    @PostMapping("/{id}/approve")
    public void approve(@PathVariable Long id) {
        refundService.approveRefund(id);
    }

    @PostMapping("/{id}/reject")
    public void reject(@PathVariable Long id, @RequestBody Map<String, String> body) {
        refundService.rejectRefund(id, body.get("reason"));
    }
    @PostMapping
    public void create(@RequestBody RefundResponseDTO dto) {
        refundService.create(dto);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable Long id, @RequestBody RefundResponseDTO dto) {
        refundService.update(id, dto);
    }
}
