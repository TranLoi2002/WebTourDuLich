package iuh.fit.booking_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Date;

@Data
public class LightTourDTO {
    @JsonProperty("id")
    private Long tourId;
    private String tourCode;
    private String title;
    private Double price;
    private Integer maxParticipants;
    private Integer currentParticipants;
    private Date startDate;
}