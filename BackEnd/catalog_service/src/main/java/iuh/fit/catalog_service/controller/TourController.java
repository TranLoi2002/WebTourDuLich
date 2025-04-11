package iuh.fit.catalog_service.controller;

import iuh.fit.catalog_service.dto.TourDTO;
import iuh.fit.catalog_service.model.Tour;
import iuh.fit.catalog_service.repository.TourRepository;
import iuh.fit.catalog_service.service.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping
    public ResponseEntity<List<Tour>> getAllTours() {
        List<Tour> tours = tourService.getAllTours();
        return ResponseEntity.ok(tours);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tour> getTourById(@PathVariable Long id) {
        Tour tourDTO = tourRepository.findById(id).orElse(null);
        if (tourDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tourDTO);
    }




    @PostMapping
    public ResponseEntity<Tour> saveTour(@RequestBody Tour tour) {
        return ResponseEntity.ok(tourService.saveTour(tour));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Tour> updateTour(@PathVariable Long id, @RequestBody Tour updatedTour) {
        if (id == null) {
            throw new IllegalArgumentException("The given id must not be null");
        }
        Tour updated = tourService.updateTour(id, updatedTour);
        return ResponseEntity.ok(updated);
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
}
