///*
// * @ (#) paymentClient.java 1.0 4/26/2025
// *
// * Copyright (c) 2025 IUH.All rights reserved
// */
//package iuh.fit.booking_service.client.payment;
//
//import iuh.fit.booking_service.dto.PaymentDTO;
//import org.springframework.cloud.openfeign.FeignClient;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//
////@FeignClient(name = "PAYMENT-SERVICE", path = "/payment")
//public interface PaymentClient {
//    ///CREATE BOOKING --> CREATE PAYMENT
//    @PostMapping()
//    void createPayment(@RequestBody PaymentDTO dto);
//    ///  CANCEL --> IF(PENDING) --> DELET PAYEMTN
//
//    // /find-by-booking/{id} getPaymentByBookingId(id, Resbody long booking id)
//    // /{id}   deletePayment(id)
//}
