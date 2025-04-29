package iuh.fit.booking_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PaymentMethodDTO {
    @JsonProperty("id")
    private Long id;
    private String name;
    private boolean active;

}
