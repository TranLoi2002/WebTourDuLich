package iuh.fit.booking_service.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;

@Data
public class TourDTO {
    private Long tourId;
    private String tourCode;
    private String title;
    private String description;
    private String highlights;
    private Double price;
    private int discount;
    private String placeOfDeparture;
    private String duration;
    private ZonedDateTime startDate;
    private LocalDate endDate;
    private Integer maxParticipants;
    private boolean isActivityTour;
    private Integer currentParticipants;
    private String thumbnail;
    private List<String> images;
    private Double averageRating;
    private Long totalReviews;
}
