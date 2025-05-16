package iuh.fit.se.catalogservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TourTypeDTO {
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;
    private String description;
}
