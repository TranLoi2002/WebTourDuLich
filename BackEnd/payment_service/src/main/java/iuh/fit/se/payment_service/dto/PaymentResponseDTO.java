package iuh.fit.se.payment_service.dto;

import iuh.fit.se.payment_service.entity.PaymentMethod;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PaymentResponseDTO {
    private Long id;
    private Double amount;
    private Long bookingId;
    private String status;
    private PaymentMethod methodName;
    private LocalDateTime createdAt;
    private Long userId;
}
