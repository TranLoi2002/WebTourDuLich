package iuh.fit.se.payment_service.service.impl;

import iuh.fit.se.payment_service.dto.RefundResponseDTO;
import iuh.fit.se.payment_service.entity.Refund;
import iuh.fit.se.payment_service.service.RefundService;
import org.springframework.stereotype.Service;

@Service
public class RefundServiceImpl implements RefundService {

    @Override
    public RefundResponseDTO initiateRefund(Refund request) {
        return null;
    }

    @Override
    public RefundResponseDTO getRefundStatus(Long refundId) {
        return null;
    }

    @Override
    public RefundResponseDTO getRefundById(Long id) {
        return null;
    }

    @Override
    public RefundResponseDTO processRefund(Refund refundRequest) {
        return null;
    }
}
