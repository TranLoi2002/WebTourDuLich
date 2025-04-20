package iuh.fit.se.catalogservice.dto;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class TourDTO {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String duration;
    private Date startDate;
    private Date endDate;
    private Integer maxParticipants;
    private Integer currentParticipants;
    private String thumbnail;
    private List<String> images;
    private LocationDTO location;
}
