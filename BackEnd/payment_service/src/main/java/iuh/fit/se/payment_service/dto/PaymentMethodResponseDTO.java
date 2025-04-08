package iuh.fit.se.payment_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentMethodResponseDTO {
    private Long id;
    private String name;
    private boolean active;
}
