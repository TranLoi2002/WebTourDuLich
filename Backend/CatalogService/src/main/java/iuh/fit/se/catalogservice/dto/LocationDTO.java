package iuh.fit.se.catalogservice.dto;

import lombok.Data;

import java.util.List;

@Data
public class LocationDTO {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String country;
    private List<TourDTO> tours;
}
