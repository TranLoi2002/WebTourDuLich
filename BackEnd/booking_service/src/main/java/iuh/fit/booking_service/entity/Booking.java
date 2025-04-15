package iuh.fit.booking_service.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings", indexes = {
        @Index(name = "idx_tour_id", columnList = "tourId"),
        @Index(name = "idx_user_id", columnList = "userId")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
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

    @Column(nullable = false)
    private LocalDateTime bookingDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BookingStatus bookingStatus;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column
    private LocalDateTime paymentDueTime;

    @Column
    private String notes;

    public void addParticipant(Participant participant) {
        participants.add(participant);
        participant.setBooking(this);
    }

    @Transient
    public boolean isPaymentDueTimeRelevant() {
        return bookingStatus == BookingStatus.PENDING;
    }

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