package iuh.fit.se.payment_service.service;

import iuh.fit.se.payment_service.dto.RefundResponseDTO;
import iuh.fit.se.payment_service.entity.Refund;
import iuh.fit.se.payment_service.repository.RefundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface RefundService {
    @Autowired
    private RefundRepository refundRepository;

    public RefundResponseDTO processRefund(Refund refund) {
        Refund savedRefund = refundRepository.save(refund);
        return new RefundResponseDTO(savedRefund.getId(), savedRefund.getAmount(), savedRefund.getStatus());
    }

    public RefundResponseDTO getRefundById(Long id) {
        Optional<Refund> refund = refundRepository.findById(id);
        if (refund.isPresent()) {
            return new RefundResponseDTO(refund.get().getId(), refund.get().getAmount(), refund.get().getStatus());
        } else {
            throw new RefundNotFoundException("Refund not found for id: " + id);
        }
    }
}
