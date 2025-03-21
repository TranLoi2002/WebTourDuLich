package iuh.fit.se.nhom2_webtourdulich_payment_service.service;

import iuh.fit.se.nhom2_webtourdulich_payment_service.model.PaymentMethod;
import iuh.fit.se.nhom2_webtourdulich_payment_service.repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentMethodService {

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    public List<PaymentMethod> getAllPaymentMethods() {
        return paymentMethodRepository.findAll();
    }

    public PaymentMethod getPaymentMethodById(Long id) {
        return paymentMethodRepository.findById(id).orElse(null);
    }

    public PaymentMethod createPaymentMethod(PaymentMethod paymentMethod) {
        return paymentMethodRepository.save(paymentMethod);
    }

    public PaymentMethod updatePaymentMethod(Long id, PaymentMethod paymentMethod) {
        paymentMethod.setId(id);
        return paymentMethodRepository.save(paymentMethod);
    }

    public void deletePaymentMethod(Long id) {
        paymentMethodRepository.deleteById(id);
    }
}
