package iuh.fit.se.payment_service.controller;

import iuh.fit.se.payment_service.dto.PaymentMethodDTO;
import iuh.fit.se.payment_service.dto.PaymentMethodResponseDTO;
import iuh.fit.se.payment_service.entity.Payment;
import iuh.fit.se.payment_service.entity.PaymentMethod;
import iuh.fit.se.payment_service.service.PaymentMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
@RequiredArgsConstructor
public class PaymentMethodController {
    private final PaymentMethodService paymentMethodService;

    @PostMapping
    public void create(@RequestBody PaymentMethodDTO dto) {
        paymentMethodService.create(dto);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable Long id, @RequestBody PaymentMethodDTO dto) {
        paymentMethodService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        paymentMethodService.delete(id);
    }

    @GetMapping
    public List<PaymentMethodResponseDTO> getAll() {
        return paymentMethodService.getAll();
    }
    public PaymentMethodController(PaymentMethodService paymentMethodService) {
        this.paymentMethodService = paymentMethodService;
    }
}