package iuh.fit.se.payment_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentMethodResponseDTO {
    private String id;          // Unique identifier for the payment method
    private String name;        // Name of the payment method (e.g., Credit Card, PayPal)
    private String logoUrl;     // URL for the logo of the payment method
    private boolean isActive;
}
