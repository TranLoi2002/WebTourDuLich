package iuh.fit.se.payment_service.controller;

import iuh.fit.se.payment_service.service.RefundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/refunds")
public class RefundController {

    @Autowired
    private RefundService refundService;

    @PostMapping
    public ResponseEntity<RefundResponseDTO> createRefund(@RequestBody RefundRequestDTO refundRequest) {
        RefundResponseDTO response = refundService.createRefund(refundRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RefundResponseDTO> getRefund(@PathVariable Long id) {
        RefundResponseDTO response = refundService.getRefundById(id);
        return ResponseEntity.ok(response);
    }
}
