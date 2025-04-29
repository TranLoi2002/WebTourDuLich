package iuh.fit.booking_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentDTO {
    @JsonProperty("id")
    private Long id;
    private Double amount;
    private Long bookingId;
    private String status = "PENDING";
    private PaymentMethodDTO method;
    private LocalDateTime createdAt;
    private Long userId;
}
