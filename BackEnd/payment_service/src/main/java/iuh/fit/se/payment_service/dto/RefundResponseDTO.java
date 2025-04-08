package iuh.fit.se.payment_service.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RefundResponseDTO {
    private Long id;
    private Long paymentId;
    private String status;
    private String reason;
    private LocalDateTime createdAt;
}
