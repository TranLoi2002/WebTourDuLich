package iuh.fit.se.payment_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponseDTO {
    private String paymentId;         // Unique identifier for the payment
    private String transactionId;      // Identifier for the transaction
    private String status;             // Status of the payment (e.g., SUCCESS, FAILED)
    private double amount;             // Amount paid
    private String currency;           // Currency of the payment
    private String message;

    public PaymentResponseDTO(Long paymentId, String paymentSuccessful) {
    }
}
