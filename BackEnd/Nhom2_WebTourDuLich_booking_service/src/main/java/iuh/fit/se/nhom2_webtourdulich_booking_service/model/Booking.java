package iuh.fit.se.nhom2_webtourdulich_booking_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "Booking")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Booking_ID")
    private Long bookingId;

    @Column(name = "Service_ID")
    private Long serviceId;

    @Column(name = "User_ID")
    private Long userId;

    @Column(name = "Booking_Date")
    private Date bookingDate;

    @Column(name = "Status")
    private String status;


}
