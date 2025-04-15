package iuh.fit.booking_service.dto;

import iuh.fit.booking_service.entity.BookingStatus;
import iuh.fit.booking_service.entity.Gender;
import iuh.fit.booking_service.entity.AgeType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BookingResponseDTO {
    private Long id;
    private UserDTO user;
    private TourDTO tour;
    private String tourCode;
    private BookingStatus bookingStatus;
    private List<ParticipantInfo> participants;
    private LocalDateTime bookingDate;
    private LocalDateTime updatedAt;
    private LocalDateTime paymentDueTime;
    private String notes;
    private boolean paymentDueTimeRelevant;

    @Data
    public static class ParticipantInfo {
        private Long id;
        private String fullName;
        private String phoneNumber;
        private Gender gender;
        private AgeType ageType;
    }

    public boolean isPaymentDueTimeRelevant() {
        return bookingStatus == BookingStatus.PENDING;
    }
}