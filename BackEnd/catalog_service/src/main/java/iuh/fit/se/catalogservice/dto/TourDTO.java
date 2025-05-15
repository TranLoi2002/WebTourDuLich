package iuh.fit.se.catalogservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class TourDTO {
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @JsonIgnore
//    @NotBlank(message = "Tour code is required")
    private String tourCode;

    @NotBlank(message = "Description is required")
    private String description;

    private String highlights;

    private boolean isActivityTour;

    private int discount;

    @NotBlank(message = "Place of departure is required")
    private String placeOfDeparture;

    @NotNull(message = "Price is required")
    private Double price;

    @JsonIgnore
//    @NotBlank(message = "Duration is required")
    private String duration;

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date must be in the future or present")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "UTC")
    private Date startDate;

    @NotNull(message = "End date is required")
    @Future(message = "End date must be in the future")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "UTC")
    private Date endDate;

    @NotNull(message = "Max participants is required")
    private Integer maxParticipants;

    private Integer currentParticipants;

    private String thumbnail;

    private List<String> images;

    @NotNull(message = "Location ID is required")
    private Long locationId;

    @NotNull(message = "Tour type ID is required")
    private Long tourTypeId;
}

