package iuh.fit.se.payment_service.dto;

import java.math.BigDecimal;

public class RevenueDTO {
    private BigDecimal totalRevenue;
    private Long totalTransactions;

    public RevenueDTO(BigDecimal total, long size) {
    }
}
