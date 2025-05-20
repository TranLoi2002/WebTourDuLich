package iuh.fit.se.payment_service.service;

import iuh.fit.se.payment_service.dto.PaymentMethodDTO;
import iuh.fit.se.payment_service.dto.PaymentMethodResponseDTO;
import iuh.fit.se.payment_service.repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import iuh.fit.se.payment_service.entity.PaymentMethod;

import java.util.List;

@Service
public interface PaymentMethodService {
    void create(PaymentMethodDTO dto);
    void update(Long id, PaymentMethodDTO dto);
    void delete(Long id);
    List<PaymentMethodResponseDTO> getAllFiltered(String name, Boolean active);

    PaymentMethodResponseDTO getById(Long id);
}