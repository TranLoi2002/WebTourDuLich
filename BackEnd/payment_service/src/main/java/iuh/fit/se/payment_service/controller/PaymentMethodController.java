package iuh.fit.se.payment_service.controller;

import iuh.fit.se.payment_service.dto.PaymentMethodResponseDTO;
import iuh.fit.se.payment_service.entity.PaymentMethod;
import iuh.fit.se.payment_service.service.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
public class PaymentMethodController {

    @Autowired
    private final PaymentMethodService paymentMethodService;

    public PaymentMethodController(PaymentMethodService paymentMethodService) {
        this.paymentMethodService = paymentMethodService;
    }

    @GetMapping
    public ResponseEntity<List<PaymentMethodResponseDTO>> getAllPaymentMethods() {
        List<PaymentMethod> methods = paymentMethodService.getAllPaymentMethods();
        return ResponseEntity.ok(methods);
    }

    @PostMapping
    public <PaymentMethodRequestDTO> ResponseEntity<PaymentMethodResponseDTO> createPaymentMethod(@RequestBody PaymentMethodRequestDTO request) {
        PaymentMethodResponseDTO response = paymentMethodService.createPaymentMethod(request);
        return ResponseEntity.ok(response);
    }
}