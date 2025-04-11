package iuh.fit.booking_service.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long tourId;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Participant> participants = new ArrayList<>();



    public void addParticipant(Participant participant) {
        participants.add(participant);
        participant.setBooking(this);
    }

    @Column(nullable = false)
    private LocalDateTime bookingDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BookingStatus bookingStatus;

    @Column(nullable = false)
    private LocalDateTime updatedAt; // Thêm trường updatedAt

    @Column
    private LocalDateTime paymentDueTime; // Thời hạn thanh toán

    @Transient
    private String notes;

    // Phương thức tiện ích để kiểm tra xem có cần hiển thị thời hạn thanh toán không
    @Transient
    public boolean isPaymentDueTimeRelevant() {
        return bookingStatus == BookingStatus.PENDING;
    }

    // PrePersist và PreUpdate để tự động cập nhật thời gian
    @PrePersist
    protected void onCreate() {
        bookingDate = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}