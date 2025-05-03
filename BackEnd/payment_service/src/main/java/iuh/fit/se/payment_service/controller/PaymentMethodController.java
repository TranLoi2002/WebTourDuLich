package iuh.fit.se.payment_service.controller;

import iuh.fit.se.payment_service.dto.PaymentMethodDTO;
import iuh.fit.se.payment_service.dto.PaymentMethodResponseDTO;
import iuh.fit.se.payment_service.service.PaymentMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment/payment-methods")
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
    public List<PaymentMethodResponseDTO> getAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Boolean active
    ) {
        return paymentMethodService.getAllFiltered(name, active);
    }

    @GetMapping("/{id}")
    public PaymentMethodResponseDTO getById(@PathVariable Long id) {
        return paymentMethodService.getById(id);
    }
}