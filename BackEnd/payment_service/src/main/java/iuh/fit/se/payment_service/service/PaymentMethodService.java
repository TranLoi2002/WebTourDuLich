package iuh.fit.se.payment_service.service;

import iuh.fit.se.payment_service.repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import iuh.fit.se.payment_service.entity.PaymentMethod;

import java.util.List;

@Service
public interface PaymentMethodService {
    List<PaymentMethod> getAllPaymentMethods();
    PaymentMethod getPaymentMethodById(Long methodId);
    void addPaymentMethod(PaymentMethod method);

    void deletePaymentMethod(Long id);
}
