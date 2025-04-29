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
        @Index(name = "idx_user_id", columnList = "userId"),
        @Index(name = "idx_booking_code", columnList = "bookingCode")
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

    @Column(nullable = false, unique = true)
    private String bookingCode;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Participant> participants = new ArrayList<>();

    @Column(nullable = false)
    private LocalDateTime bookingDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BookingStatus bookingStatus;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private Double totalPrice;

    @Column
    private LocalDateTime paymentDueTime;

    @Column
    private String notes;

    @Column
    @Enumerated(EnumType.STRING)
    private CancelReason reason;

    @Column
    @Enumerated(EnumType.STRING)
    private CanceledBy canceledBy;

    @Column
    private Long paymentMethodId;
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

    public void calculateTotalPrice(double basePrice) {
        double total = 0;
        for (Participant participant : participants) {
            AgeType ageType = participant.getAgeType();
            if (ageType == null) {
                throw new IllegalStateException("AgeType cannot be null for participant: " + participant.getFullName());
            }
            switch (ageType) {
                case ADULT -> total += basePrice;
                case CHILD -> total += basePrice * 0.7;
                case BABY -> total += basePrice * 0.3;
            }
        }

        this.totalPrice = total;
    }
}