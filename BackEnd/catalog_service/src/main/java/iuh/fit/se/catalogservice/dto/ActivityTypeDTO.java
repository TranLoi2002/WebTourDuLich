package iuh.fit.se.catalogservice.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ActivityTypeDTO {
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;
}
