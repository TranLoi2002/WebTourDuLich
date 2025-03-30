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
    private LocalDateTime bookingDate;
    private BookingStatus bookingStatus;

    @Data
    public static class ParticipantInfo {
        private Long id;
        private String fullName;
        private String phoneNumber;
        private Gender gender;
        private AgeType ageType;
    }
}