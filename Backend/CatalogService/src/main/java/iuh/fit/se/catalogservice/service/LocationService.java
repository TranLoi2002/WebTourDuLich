package iuh.fit.se.catalogservice.service;

import iuh.fit.se.catalogservice.model.Location;

import java.util.List;

public interface LocationService {
    List<Location> getAllLocations();
    Location getLocationById(Long id);
    Location saveLocation(Location location);
    Location updateLocation(Long id, Location location);
    void deleteLocation(Long id);
}
