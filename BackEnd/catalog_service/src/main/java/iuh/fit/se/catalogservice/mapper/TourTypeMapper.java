package iuh.fit.se.catalogservice.mapper;

import iuh.fit.se.catalogservice.dto.TourDTO;
import iuh.fit.se.catalogservice.dto.TourTypeDTO;
import iuh.fit.se.catalogservice.model.Location;
import iuh.fit.se.catalogservice.model.Tour;
import iuh.fit.se.catalogservice.model.TourType;

public class TourTypeMapper {
    public static TourType toEntity(TourTypeDTO dto) {
        TourType tourType = new TourType();

        tourType.setName(dto.getName());
        tourType.setDescription(dto.getDescription());

        return tourType;
    }
}
