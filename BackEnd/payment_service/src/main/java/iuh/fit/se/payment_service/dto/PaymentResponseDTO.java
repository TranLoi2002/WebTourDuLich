package iuh.fit.se.payment_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponseDTO {
    private Long id;
    private BigDecimal amount;
    private String status;
    private String methodName;
    private LocalDateTime createdAt;
    private Long userId;
}
