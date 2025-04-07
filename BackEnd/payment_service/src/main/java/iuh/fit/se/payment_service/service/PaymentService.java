package iuh.fit.se.payment_service.service;

import iuh.fit.se.payment_service.dto.PaymentResponseDTO;
import iuh.fit.se.payment_service.entity.Payment;
import iuh.fit.se.payment_service.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface PaymentService {
    void initiatePayment(Payment request);
    PaymentResponseDTO processPayment(Payment request);
    PaymentResponseDTO getPaymentStatus(Long paymentId);

    PaymentResponseDTO getPaymentById(Long id);
}
