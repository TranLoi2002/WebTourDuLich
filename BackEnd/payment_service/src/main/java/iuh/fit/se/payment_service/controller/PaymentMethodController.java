package iuh.fit.se.payment_service.controller;

import iuh.fit.se.payment_service.entity.Payment;
import iuh.fit.se.payment_service.entity.PaymentMethod;
import iuh.fit.se.payment_service.service.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
public class PaymentMethodController {

    @Autowired
    private PaymentMethodService paymentMethodService;

    @GetMapping
    public List<PaymentMethod> getAllPaymentMethods() {
        return paymentMethodService.getAllPaymentMethods();
    }

    @PostMapping
    public void addPaymentMethod(@RequestBody Payment request) {
        paymentMethodService.addPaymentMethod(request.getPaymentMethod());
    }

    @DeleteMapping("/{id}")
    public void deletePaymentMethod(@PathVariable Long id) {
        paymentMethodService.deletePaymentMethod(id);
    }
}