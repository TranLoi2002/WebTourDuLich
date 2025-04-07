package iuh.fit.se.payment_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "refunds")
public class Refund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long refundId; // Khóa chính

//    @ManyToOne
//    @JoinColumn(name = "booking_id", nullable = false)
//    private Booking booking; // Khóa ngoại liên kết tới bảng Bookings

    @Temporal(TemporalType.TIMESTAMP)
    private Date refundDate;

    private Double refundAmount;

    private String refundReason;

}