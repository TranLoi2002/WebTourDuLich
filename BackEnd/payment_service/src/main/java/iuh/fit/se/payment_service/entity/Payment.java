package iuh.fit.se.payment_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId; // Payment_ID (PK)

//    @ManyToOne
//    @JoinColumn(name = "booking_id", nullable = false)
//    private Booking booking; // Booking_ID (FK)

    @ManyToOne
    @JoinColumn(name = "payment_method_id", nullable = false)
    private PaymentMethod paymentMethod; // Payment_Method_ID (FK)

    private Double amount; // Payment_Amount
    private LocalDateTime paymentDate; // Payment_Date
    private String status; // Payment_Status

    public Payment(Double amount, String processed) {
    }
}
