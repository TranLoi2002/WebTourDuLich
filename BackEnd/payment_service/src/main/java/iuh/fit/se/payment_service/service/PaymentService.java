package iuh.fit.se.payment_service.service;

import iuh.fit.se.payment_service.dto.PaymentResponseDTO;
import iuh.fit.se.payment_service.entity.Payment;
import iuh.fit.se.payment_service.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    public default PaymentResponseDTO makePayment(Payment payment) {
        Payment savedPayment = paymentRepository.save(payment);
        return new PaymentResponseDTO(savedPayment.getId(), savedPayment.getAmount(), savedPayment.getStatus());
    }

    public PaymentResponseDTO getPaymentById(Long id) {
        Optional<Payment> payment = paymentRepository.findById(id);
        if (payment.isPresent()) {
            return new PaymentResponseDTO(payment.get().getId(), payment.get().getAmount(), payment.get().getStatus());
        } else {
            throw new PaymentNotFoundException("Payment not found for id: " + id);
        }
    }
}
