package iuh.fit.catalog_service.service;

import iuh.fit.catalog_service.model.Location;

import java.util.List;

public interface LocationService {
    List<Location> getAllLocations();
    Location getLocationById(Long id);
    Location saveLocation(Location location);
    Location updateLocation(Long id, Location location);
    void deleteLocation(Long id);
}
