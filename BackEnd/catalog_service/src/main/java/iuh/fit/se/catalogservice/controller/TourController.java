package iuh.fit.se.catalogservice.controller;

import iuh.fit.se.catalogservice.dto.TourDTO;
import iuh.fit.se.catalogservice.model.Location;
import iuh.fit.se.catalogservice.model.Tour;
import iuh.fit.se.catalogservice.model.TourType;
import iuh.fit.se.catalogservice.repository.LocationRepository;
import iuh.fit.se.catalogservice.repository.TourRepository;
import iuh.fit.se.catalogservice.repository.TourTypeRepository;
import iuh.fit.se.catalogservice.service.TourService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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
    private TourRepository tourRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private TourTypeRepository tourTypeRepository;

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
    public ResponseEntity<?> createTour(@Valid @RequestBody TourDTO tourDTO) {
        Tour createdTour = tourService.saveTour(tourDTO);
        return new ResponseEntity<>(createdTour, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTour(@PathVariable Long id, @Valid @RequestBody TourDTO tourDTO) {
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
    public ResponseEntity<Tour> updateCurrentParticipants(@PathVariable Long id, @RequestParam Integer currentParticipants) {
        Tour updatedTour = tourService.updateCurrentParticipants(id, currentParticipants);
        return ResponseEntity.ok(updatedTour);
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
