package iuh.fit.catalog_service.service.impl;

import iuh.fit.catalog_service.model.Location;
import iuh.fit.catalog_service.repository.LocationRepository;
import iuh.fit.catalog_service.service.LocationService;
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
                    existingLocation.setImageUrl(location.getImageUrl());
                    existingLocation.setDescription(location.getDescription());
                    existingLocation.setType(location.getType());

                    return locationRepository.save(existingLocation);
                })
                .orElseThrow(() -> new IllegalArgumentException("Location not found"));
    }

    @Override
    public void deleteLocation(Long id) {
        locationRepository.deleteById(id);
    }
}
