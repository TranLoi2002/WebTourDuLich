package iuh.fit.se.nhom2_webtourdulich_payment_service.controller;

import iuh.fit.se.nhom2_webtourdulich_payment_service.model.PaymentMethod;
import iuh.fit.se.nhom2_webtourdulich_payment_service.service.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment-methods")
public class PaymentMethodController {

    @Autowired
    private PaymentMethodService paymentMethodService;

    @GetMapping
    public List<PaymentMethod> getAllPaymentMethods() {
        return paymentMethodService.getAllPaymentMethods();
    }

    @GetMapping("/{id}")
    public PaymentMethod getPaymentMethodById(@PathVariable Long id) {
        return paymentMethodService.getPaymentMethodById(id);
    }

    @PostMapping
    public PaymentMethod createPaymentMethod(@RequestBody PaymentMethod paymentMethod) {
        return paymentMethodService.createPaymentMethod(paymentMethod);
    }

    @PutMapping("/{id}")
    public PaymentMethod updatePaymentMethod(@PathVariable Long id, @RequestBody PaymentMethod paymentMethod) {
        return paymentMethodService.updatePaymentMethod(id, paymentMethod);
    }

    @DeleteMapping("/{id}")
    public void deletePaymentMethod(@PathVariable Long id) {
        paymentMethodService.deletePaymentMethod(id);
    }
}