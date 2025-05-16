package iuh.fit.se.catalogservice.dto;

import iuh.fit.se.catalogservice.model.LocationType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
public class LocationDTO {
    private Long id;
    private String name;
    private String description;
    private String imgUrl;
    @Enumerated(EnumType.STRING)
    private LocationType type;
}
