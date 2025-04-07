package iuh.fit.se.payment_service.service.impl;

import iuh.fit.se.payment_service.entity.PaymentMethod;
import iuh.fit.se.payment_service.repository.PaymentMethodRepository;
import iuh.fit.se.payment_service.service.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentMethodServiceImpl implements PaymentMethodService {


    @Override
    public List<PaymentMethod> getAllPaymentMethods() {
        return null;
    }

    @Override
    public PaymentMethod getPaymentMethodById(Long methodId) {
        return null;
    }

    @Override
    public void addPaymentMethod(PaymentMethod method) {

    }

    @Override
    public void deletePaymentMethod(Long id) {

    }
}
