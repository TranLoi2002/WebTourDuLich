/*
 * @ (#) paymentClient.java 1.0 4/26/2025
 *
 * Copyright (c) 2025 IUH.All rights reserved
 */
package iuh.fit.booking_service.client.payment;

import org.springframework.cloud.openfeign.FeignClient;

//@FeignClient(name = "PAYMENT-SERVICE", path = "")
public interface PaymentClient {
    /// CREATE PAYMENT
    ///  UPDATE STATUS PAYMENT -->CANCEL ->>> PAYMENT CREATE REFUND
}
