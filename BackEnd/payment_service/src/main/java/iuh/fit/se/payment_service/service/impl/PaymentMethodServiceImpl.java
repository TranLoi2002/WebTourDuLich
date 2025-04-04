package iuh.fit.se.payment_service.service.impl;

import iuh.fit.se.payment_service.entity.PaymentMethod;
import iuh.fit.se.payment_service.repository.PaymentMethodRepository;
import iuh.fit.se.payment_service.service.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentMethodServiceImpl implements PaymentMethodService {
    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    @Override
    public List<PaymentMethod> getAllPaymentMethods() {
        return paymentMethodRepository.findAll();
    }

    @Override
    public PaymentMethod getPaymentMethodById(Long id) {
        return paymentMethodRepository.findById(id).orElse(null);
    }

    @Override
    public RefundMethod createPaymentMethod(RefundMethod refundMethod) {
        return paymentMethodRepository.save(refundMethod);
    }

    @Override
    public void deletePaymentMethod(Long id) {
        paymentMethodRepository.deleteById(id);
    }
}
