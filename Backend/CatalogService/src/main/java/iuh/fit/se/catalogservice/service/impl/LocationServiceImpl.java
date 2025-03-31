package iuh.fit.se.catalogservice.service.impl;

import iuh.fit.se.catalogservice.model.Location;
import iuh.fit.se.catalogservice.repository.LocationRepository;
import iuh.fit.se.catalogservice.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationServiceImpl implements LocationService {
    @Autowired
    private LocationRepository locationRepository;

    public LocationServiceImpl() {
        super();
    }

    @Override
    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    @Override
    public Location getLocationById(Long id) {
        return locationRepository.findById(id).orElse(null);
    }

    @Override
    public Location saveLocation(Location location) {
        return locationRepository.save(location);
    }

    @Override
    public Location updateLocation(Long id, Location location) {
        return locationRepository.findById(id)
                .map(existingLocation -> {
                    existingLocation.setName(location.getName());
                    existingLocation.setAddress(location.getAddress());
                    existingLocation.setCity(location.getCity());
                    existingLocation.setCountry(location.getCountry());
                    return locationRepository.save(existingLocation);
                })
                .orElseThrow(() -> new IllegalArgumentException("Location not found"));
    }

    @Override
    public void deleteLocation(Long id) {
        locationRepository.deleteById(id);
    }
}
