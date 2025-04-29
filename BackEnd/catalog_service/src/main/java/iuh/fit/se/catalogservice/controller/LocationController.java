package iuh.fit.se.catalogservice.controller;

import iuh.fit.se.catalogservice.dto.LocationDTO;
import iuh.fit.se.catalogservice.dto.TourDTO;
import iuh.fit.se.catalogservice.model.Location;
import iuh.fit.se.catalogservice.model.Tour;
import iuh.fit.se.catalogservice.repository.LocationRepository;
import iuh.fit.se.catalogservice.service.LocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/catalog/locations")
public class LocationController {
    @Autowired
    private LocationService locationService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllLocations(@RequestParam Map<String, String> params) {
        Map<String, Object> response = locationService.getAllLocations(params);
        return ResponseEntity.ok(response);
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
    public ResponseEntity<Location> saveLocation(@Valid @RequestBody LocationDTO dto) {
        Location createdLocation = locationService.saveLocation(dto);
        return new ResponseEntity<>(createdLocation, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateLocation(@PathVariable Long id, @Valid @RequestBody LocationDTO dto) {
        Location update = locationService.updateLocation(id, dto);
        return ResponseEntity.ok(update);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {
        locationService.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }


}
