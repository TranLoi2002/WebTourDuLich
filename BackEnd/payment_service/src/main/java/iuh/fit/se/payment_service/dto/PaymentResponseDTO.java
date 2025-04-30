package iuh.fit.se.payment_service.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PaymentResponseDTO {
    private Long id;
    private Double amount;
    private String status;
    private Long methodId;
    private LocalDateTime createdAt;
    private Long userId;
    private Long bookingId;
}