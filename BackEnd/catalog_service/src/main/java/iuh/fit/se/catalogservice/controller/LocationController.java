package iuh.fit.se.catalogservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import iuh.fit.se.catalogservice.dto.LocationDTO;
import iuh.fit.se.catalogservice.dto.TourDTO;
import iuh.fit.se.catalogservice.model.Location;
import iuh.fit.se.catalogservice.model.Tour;
import iuh.fit.se.catalogservice.repository.LocationRepository;
import iuh.fit.se.catalogservice.service.LocationService;
import iuh.fit.se.catalogservice.service.impl.CloudinaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/catalog/locations")
public class LocationController {
    @Autowired
    private LocationService locationService;

    @Autowired
    private CloudinaryService cloudinaryService;

    private final ObjectMapper objectMapper;

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
    public ResponseEntity<Location> saveLocation(
            @RequestParam("image") MultipartFile image,
            @RequestParam("location") String locationJson) {

        // Validate the image file
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }
        if (!Arrays.asList("image/jpeg", "image/png").contains(image.getContentType())) {
            throw new IllegalArgumentException("Image must be JPEG or PNG");
        }
        if (image.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("Image file size must not exceed 5MB");
        }

        // Parse JSON into LocationDTO
        LocationDTO locationDTO;
        try {
            locationDTO = objectMapper.readValue(locationJson, LocationDTO.class);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid location JSON format", e);
        }

        // Upload image to Cloudinary
        String imageUrl = cloudinaryService.uploadFile(image);
        locationDTO.setImgUrl(imageUrl);

        // Save the location
        Location createdLocation = locationService.saveLocation(locationDTO);
        return new ResponseEntity<>(createdLocation, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateLocation(
            @PathVariable Long id,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("location") String locationJson) {

        // Parse JSON into LocationDTO
        LocationDTO locationDTO;
        try {
            locationDTO = objectMapper.readValue(locationJson, LocationDTO.class);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid location JSON format", e);
        }

        // Handle image upload if provided
        if (image != null && !image.isEmpty()) {
            if (!Arrays.asList("image/jpeg", "image/png").contains(image.getContentType())) {
                throw new IllegalArgumentException("Image must be JPEG or PNG");
            }
            if (image.getSize() > 5 * 1024 * 1024) {
                throw new IllegalArgumentException("Image file size must not exceed 5MB");
            }
            String imageUrl = cloudinaryService.uploadFile(image);
            locationDTO.setImgUrl(imageUrl);
        }

        // Update the location
        Location updatedLocation = locationService.updateLocation(id, locationDTO);
        return ResponseEntity.ok(updatedLocation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {
        locationService.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }


}
