package iuh.fit.se.payment_service.dto;

import java.math.BigDecimal;

public class StatisticDTO {
    private Long totalPayments;
    private Long totalRefunds;
    private Double totalRevenue;

    public StatisticDTO(long size, long l, BigDecimal total) {
    }
}
