package iuh.fit.booking_service.client.payment;

import iuh.fit.booking_service.dto.PaymentMethodDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "REFUND-SERVICE", path = "/payment/payment-method")
public interface PaymentMethodClient {
    @GetMapping("/{id}")
    PaymentMethodDTO getPaymentMethodById(@PathVariable Long id);

}
