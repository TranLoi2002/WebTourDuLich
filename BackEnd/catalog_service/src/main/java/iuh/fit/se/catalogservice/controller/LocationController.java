package iuh.fit.se.catalogservice.controller;

import iuh.fit.se.catalogservice.model.Location;
import iuh.fit.se.catalogservice.repository.LocationRepository;
import iuh.fit.se.catalogservice.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/catalog/locations")
public class LocationController {
    @Autowired
    private LocationService locationService;

    @GetMapping
    public ResponseEntity<List<Location>> getAllLocations() {
        return ResponseEntity.ok(locationService.getAllLocations());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Location>> getLocationsByActive(@RequestParam boolean isActive) {
        return ResponseEntity.ok(locationService.getLocationsByIsActive(isActive));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Location> getLocationById(@PathVariable Long id) {
        Location location = locationService.getLocationById(id);
        return location != null ? ResponseEntity.ok(location) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Location> saveLocation(@RequestBody Location location) {
        return ResponseEntity.ok(locationService.saveLocation(location));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Location> updateLocation(Long id, Location updatedLocation) {
        if (id == null) {
            throw new IllegalArgumentException("The given id must not be null");
        }
        Location updated = locationService.updateLocation(id, updatedLocation);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {
        locationService.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }


}
