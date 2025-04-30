package iuh.fit.booking_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PaymentDTO {
    @JsonProperty("id")
    private Long id;
    private Double amount;
    private String status;
    private Long methodId;
    private LocalDateTime createdAt;
    private Long userId;
    private Long bookingId;
}