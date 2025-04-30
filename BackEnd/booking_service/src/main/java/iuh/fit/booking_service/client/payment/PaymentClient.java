/*
 * @ (#) PaymentClient.java 1.0 4/26/2025
 *
 * Copyright (c) 2025 IUH.All rights reserved
 */
package iuh.fit.booking_service.client.payment;

import iuh.fit.booking_service.dto.PaymentDTO;
import iuh.fit.booking_service.dto.PaymentMethodDTO;
import iuh.fit.booking_service.dto.RefundDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "PAYMENT-SERVICE", path = "/payment")
public interface PaymentClient {
    /// CREATE BOOKING --> CREATE PAYMENT
    @GetMapping("/payment-methods/{id}")
    PaymentMethodDTO getPaymentMethodsById(@PathVariable Long id);

    @PostMapping("/payments")
    void createPayment(@RequestBody PaymentDTO dto);

    /// CANCEL --> IF(PENDING) --> PAYMENT STATUS == CANCELLED
    @PutMapping("/payments/update-cancel-status/{id}")
    void cancelPayment(@PathVariable Long id);

    /// CANCEL --> IF(CONFIRM) --> PAYMENT STATUS == REFUND + CREATE REFUND
    @PutMapping("/payments/update-refund-status/{id}")
    void refundPayment(@PathVariable Long id);

    @GetMapping("/payments/get-payment-by-bookingId")
    PaymentDTO getPaymentByBookingId(@RequestParam Long bookingId);

    // Create refund
    @PostMapping("/refunds")
    void createRefundPayment(@RequestBody RefundDTO dto);
}