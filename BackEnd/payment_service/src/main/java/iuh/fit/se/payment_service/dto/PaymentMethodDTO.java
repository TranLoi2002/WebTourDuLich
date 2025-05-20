package iuh.fit.se.payment_service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentMethodDTO {
    private String name;
    private boolean active;
}