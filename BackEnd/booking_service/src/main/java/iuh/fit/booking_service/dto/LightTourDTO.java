package iuh.fit.booking_service.dto;

import lombok.Data;

import java.util.Date;

@Data
public class LightTourDTO {
    private Long tourId;
    private String tourCode;
    private String title;
    private Double price;
    private Integer maxParticipants;
    private Integer currentParticipants;
    private Date startDate;
}