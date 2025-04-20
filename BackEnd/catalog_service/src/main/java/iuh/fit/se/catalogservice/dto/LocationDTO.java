package iuh.fit.se.catalogservice.dto;

import lombok.Data;

import java.util.List;

@Data
public class LocationDTO {
    private Long id;
    private String name;
    private String description;
    private String thumbnail;
    private List<String> images;
    private boolean isActive;
}
