package iuh.fit.se.catalogservice.mapper;

import iuh.fit.se.catalogservice.dto.LocationDTO;
import iuh.fit.se.catalogservice.dto.TourDTO;
import iuh.fit.se.catalogservice.model.Location;
import iuh.fit.se.catalogservice.model.Tour;
import iuh.fit.se.catalogservice.model.TourType;

public class LocationMapper {
    public static Location toEntity(LocationDTO dto) {
        Location location = new Location();
        location.setName(dto.getName());
        location.setDescription(dto.getDescription());
        location.setImageUrl(dto.getImgUrl());
        location.setType(dto.getType());
        location.setActive(true);
        return location;
    }
}
