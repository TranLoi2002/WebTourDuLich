package iuh.fit.se.catalogservice.service;

import iuh.fit.se.catalogservice.dto.LocationDTO;
import iuh.fit.se.catalogservice.model.Location;

import java.util.List;
import java.util.Map;

public interface LocationService {
    Map<String, Object> getAllLocations(Map<String, String> params);
    List<Location> getLocationsByIsActive(boolean isActive);
    Location getLocationById(Long id);
    Location saveLocation(LocationDTO dto);
    Location updateLocation(Long id, LocationDTO dto);
    void deleteLocation(Long id);
}
