package iuh.fit.se.payment_service.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RefundResponseDTO {
    private String refundId;            // Unique identifier for the refund
    private String paymentId;           // Corresponding payment ID for the refund
    private String status;               // Status of the refund (e.g., SUCCESS, FAILED)
    private double refundedAmount;      // Amount refunded
    private String currency;            // Currency of the refund
    private String message;
}
