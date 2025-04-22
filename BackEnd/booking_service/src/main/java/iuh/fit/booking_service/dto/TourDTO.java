package iuh.fit.booking_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class TourDTO {
    @JsonProperty("id")
    private Long tourId;
    private String tourCode;
    private String title;
    private String description;
    private String highlights;
    private boolean isActive;
    private boolean isActivityTour;
    private Double price;
    private Integer discount;
    private String placeOfDeparture;
    private String duration;
    private Date startDate;
    private Date endDate;
    private Integer maxParticipants;
    private Integer currentParticipants;
    private String thumbnail;
    private List<String> images;
    private Double averageRating;
    private Long totalReviews;
}