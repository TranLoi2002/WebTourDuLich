package iuh.fit.se.catalogservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ActivityTypeDTO {
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;
}
