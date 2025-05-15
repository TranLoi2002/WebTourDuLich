package iuh.fit.user_service.dto;

import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TourDTO {
    private Long id;
    private String tourCode;
    private String title;
    private String description;
    private String highlights;
    private boolean isActivityTour;
    private Double price;
    private int discount;
    private String placeOfDeparture;
    private String duration;
    private Date startDate;
    private Date endDate;
    private Integer maxParticipants;
    private Integer currentParticipants;
    private String thumbnail;
    private List<String> images;

//    private Double averageRating;
//    private Long totalReviews;
    private Long locationId; // Thay thế cho Location entity
    private Long tourTypeId; // Thay thế cho TourType entity
//    private Set<Long> activityTypeIds; // Thay thế cho ActivityType entity
}