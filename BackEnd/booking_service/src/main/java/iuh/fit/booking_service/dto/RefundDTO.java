package iuh.fit.booking_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class RefundDTO {
    @JsonProperty("id")
    private Long id;
    private Long paymentId;
    private String status;
    private String reason;
    private LocalDateTime createdAt;
}
