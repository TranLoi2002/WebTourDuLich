package iuh.fit.se.catalogservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import iuh.fit.se.catalogservice.dto.TourDTO;
import iuh.fit.se.catalogservice.model.Tour;
import iuh.fit.se.catalogservice.service.TourService;
import iuh.fit.se.catalogservice.service.impl.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/catalog/tours")
@RequiredArgsConstructor
public class TourController {
    @Autowired
    private TourService tourService;

    @Autowired
    private CloudinaryService cloudinaryService;

    private final ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllTours(@RequestParam Map<String, String> params) {
        Map<String, Object> response = tourService.getAllTours(params);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tour> getTourById(@PathVariable Long id) {
        Optional<Tour> tour = tourService.getTourByIdWithRating(id);
        return tour.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createTour(
            @RequestParam("thumbnail") MultipartFile thumbnail,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam("tour") String tourJson) {

        // Validate the thumbnail file
        if (thumbnail == null || thumbnail.isEmpty()) {
            throw new IllegalArgumentException("Thumbnail file is required");
        }
        if (!Arrays.asList("image/jpeg", "image/png").contains(thumbnail.getContentType())) {
            throw new IllegalArgumentException("Thumbnail must be JPEG or PNG");
        }
        if (thumbnail.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("Thumbnail file size must not exceed 5MB");
        }

        // Parse JSON into TourDTO
        TourDTO tourDTO;
        try {
            tourDTO = objectMapper.readValue(tourJson, TourDTO.class);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Invalid tour JSON format", e);
        }

        // Upload thumbnail to Cloudinary
        String thumbnailUrl = cloudinaryService.uploadFile(thumbnail);
        tourDTO.setThumbnail(thumbnailUrl);

        // Upload images to Cloudinary (if provided)
        if (images != null && !images.isEmpty()) {
            List<String> imageUrls = images.stream().map(image -> {
                if (!Arrays.asList("image/jpeg", "image/png").contains(image.getContentType())) {
                    throw new IllegalArgumentException("Each image must be JPEG or PNG");
                }
                if (image.getSize() > 5 * 1024 * 1024) {
                    throw new IllegalArgumentException("Each image file size must not exceed 5MB");
                }
                return cloudinaryService.uploadFile(image);
            }).toList();
            tourDTO.setImages(imageUrls);
        }

        // Save the tour
        Tour createdTour = tourService.saveTour(tourDTO);
        return new ResponseEntity<>(createdTour, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTour(
            @PathVariable Long id,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam("tour") String tourJson) {

        // Parse JSON into TourDTO
        TourDTO tourDTO;
        try {
            tourDTO = objectMapper.readValue(tourJson, TourDTO.class);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Invalid tour JSON format", e);
        }

        // Handle thumbnail upload if provided
        if (thumbnail != null && !thumbnail.isEmpty()) {
            if (!Arrays.asList("image/jpeg", "image/png").contains(thumbnail.getContentType())) {
                throw new IllegalArgumentException("Thumbnail must be JPEG or PNG");
            }
            if (thumbnail.getSize() > 5 * 1024 * 1024) {
                throw new IllegalArgumentException("Thumbnail file size must not exceed 5MB");
            }
            String thumbnailUrl = cloudinaryService.uploadFile(thumbnail);
            tourDTO.setThumbnail(thumbnailUrl);
        }

        // Handle images upload if provided
        if (images != null && !images.isEmpty()) {
            List<String> imageUrls = images.stream().map(image -> {
                if (!Arrays.asList("image/jpeg", "image/png").contains(image.getContentType())) {
                    throw new IllegalArgumentException("Each image must be JPEG or PNG");
                }
                if (image.getSize() > 5 * 1024 * 1024) {
                    throw new IllegalArgumentException("Each image file size must not exceed 5MB");
                }
                return cloudinaryService.uploadFile(image);
            }).toList();
            tourDTO.setImages(imageUrls);
        }

        // Update the tour
        Tour updatedTour = tourService.updateTour(id, tourDTO);
        return ResponseEntity.ok(updatedTour);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTour(@PathVariable Long id) {
        tourService.deleteTour(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/activitytour/{activityTypeName}")
    public ResponseEntity<List<Tour>> getToursByActivityType(@PathVariable String activityTypeName) {
        List<Tour> tours = tourService.getToursByActivityType(activityTypeName);
        return ResponseEntity.ok(tours);
    }
    @PutMapping("/update/current-participants/{id}")
    public ResponseEntity<Tour> updateCurrentParticipants(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> requestBody) {
//        logger.info("Received request to update participants for tour {} with body: {}", id, requestBody);

        if (requestBody == null || !requestBody.containsKey("currentParticipants")) {
//            logger.error("Invalid request body: currentParticipants is missing");
            throw new IllegalArgumentException("currentParticipants is required in the request body");
        }

        Integer currentParticipants = requestBody.get("currentParticipants");
        if (currentParticipants == null) {
//            logger.error("currentParticipants cannot be null for tour {}", id);
            throw new IllegalArgumentException("currentParticipants cannot be null");
        }

        try {
            Tour updatedTour = tourService.updateCurrentParticipants(id, currentParticipants);
//            logger.info("Successfully updated tour {} with currentParticipants: {}", id, currentParticipants);
            return ResponseEntity.ok(updatedTour);
        } catch (Exception e) {
//            logger.error("Failed to update participants for tour {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to update tour participants", e);
        }
    }


    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<Map<String, Object>>> getReviewsByTourId(@PathVariable Long id) {
        List<Map<String, Object>> reviews = tourService.getReviewsByTourId(id);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/location/{locationId}")
    public ResponseEntity<List<Tour>> getToursByLocationId(@PathVariable Long locationId) {
        List<Tour> tours = tourService.getToursByLocationId(locationId);
        return ResponseEntity.ok(tours);
    }

    @GetMapping("/related/{locationId}")
    public ResponseEntity<List<Tour>> getRelatedToursByLocationId(
            @PathVariable Long locationId,
            @RequestParam Long excludeTourId,
            @RequestParam int limit) { // Thêm tham số limit
        Pageable pageable = PageRequest.of(0, limit); // Sử dụng limit từ request
        List<Tour> relatedTours = tourService.getRelatedToursByLocationId(locationId, excludeTourId, pageable);
        return ResponseEntity.ok(relatedTours);
    }

    @GetMapping("/update-tour-status")
    public ResponseEntity<String> updateTourStatusesNow() {
        tourService.updateTourStatuses();
        return ResponseEntity.ok("Tour statuses updated");
    }

}
