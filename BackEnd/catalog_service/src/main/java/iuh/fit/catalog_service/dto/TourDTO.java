package iuh.fit.catalog_service.dto;

import iuh.fit.catalog_service.model.Tour;
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

    public TourDTO(Tour tour) {
    }
}
