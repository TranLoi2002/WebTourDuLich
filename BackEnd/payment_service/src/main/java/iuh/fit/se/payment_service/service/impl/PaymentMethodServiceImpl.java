package iuh.fit.se.payment_service.service.impl;

import iuh.fit.se.payment_service.dto.PaymentMethodDTO;
import iuh.fit.se.payment_service.dto.PaymentMethodResponseDTO;
import iuh.fit.se.payment_service.entity.PaymentMethod;
import iuh.fit.se.payment_service.repository.PaymentMethodRepository;
import iuh.fit.se.payment_service.service.PaymentMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentMethodServiceImpl implements PaymentMethodService {
    private final PaymentMethodRepository paymentMethodRepository;

    @Override
    public void create(PaymentMethodDTO dto) {
        PaymentMethod method = new PaymentMethod();
        method.setName(dto.getName());
        method.setActive(dto.isActive());
        paymentMethodRepository.save(method);
    }

    @Override
    public void update(Long id, PaymentMethodDTO dto) {
        PaymentMethod method = paymentMethodRepository.findById(id).orElseThrow();
        method.setName(dto.getName());
        method.setActive(dto.isActive());
        paymentMethodRepository.save(method);
    }

    @Override
    public void delete(Long id) {
        paymentMethodRepository.deleteById(id);
    }

    @Override
    public List<PaymentMethodResponseDTO> getAllFiltered(String name, Boolean active) {
        return paymentMethodRepository.findAll().stream()
                .filter(pm -> name == null || pm.getName().toLowerCase().contains(name.toLowerCase()))
                .filter(pm -> active == null || pm.isActive() == active)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private PaymentMethodResponseDTO toDTO(PaymentMethod m) {
        PaymentMethodResponseDTO dto = new PaymentMethodResponseDTO();
        dto.setId(m.getId());
        dto.setName(m.getName());
        dto.setActive(m.isActive());
        return dto;
    }
}
