package iuh.fit.se.dto;

import iuh.fit.se.entity.BookingStatus;
import iuh.fit.se.entity.Gender;
import iuh.fit.se.entity.AgeType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BookingResponseDTO {
    private Long id;
    private Long userId;
    private Long tourId;
    private List<ParticipantInfo> participants;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private LocalDateTime bookingDate;
    private LocalDateTime updatedAt;
    private LocalDateTime paymentDueTime;
    private BookingStatus bookingStatus;
    private String notes;
    private String reason;
    private boolean paymentDueTimeRelevant;

    @Data
    public static class ParticipantInfo {
        private Long id;
        private String fullName;
        private String phoneNumber;
        private Gender gender;
        private AgeType ageType;
    }

    // Phương thức để kiểm tra xem có nên hiển thị thời hạn thanh toán không
    public boolean isPaymentDueTimeRelevant() {
        return bookingStatus == BookingStatus.PENDING || bookingStatus == BookingStatus.CONFIRMED;
    }
}