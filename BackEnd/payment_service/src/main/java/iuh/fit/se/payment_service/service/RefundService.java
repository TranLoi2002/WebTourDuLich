package iuh.fit.se.payment_service.service;

import iuh.fit.se.payment_service.dto.RefundResponseDTO;
import iuh.fit.se.payment_service.entity.Refund;
import iuh.fit.se.payment_service.repository.RefundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface RefundService {
    RefundResponseDTO initiateRefund(Refund request);
    RefundResponseDTO getRefundStatus(Long refundId);

    RefundResponseDTO getRefundById(Long id);

    RefundResponseDTO processRefund(Refund refundRequest);
}
