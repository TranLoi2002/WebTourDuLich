package iuh.fit.booking_service.dto;

import iuh.fit.booking_service.entity.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BookingResponseDTO {
    private Long id;
    private String bookingCode;
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
    private Double totalPrice;
    private CancelReason refundReason;
    private Double refundAmount;
    private RefundStatus refundStatus;
    private CanceledBy canceledBy;

    @Data
    public static class ParticipantInfo {
        private Long id;
        private String fullName;
        private Gender gender;
        private AgeType ageType;
    }

    public boolean isPaymentDueTimeRelevant() {
        return bookingStatus == BookingStatus.PENDING;
    }
}