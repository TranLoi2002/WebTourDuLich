package iuh.fit.se.payment_service.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RefundResponseDTO {
    private Long id;
    private Long paymentId;
    private double refundAmount;
    private String status;
    private String processedAt;
}
