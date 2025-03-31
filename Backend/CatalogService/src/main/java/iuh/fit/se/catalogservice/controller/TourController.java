package iuh.fit.se.catalogservice.controller;

import iuh.fit.se.catalogservice.model.Tour;
import iuh.fit.se.catalogservice.repository.TourRepository;
import iuh.fit.se.catalogservice.service.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/catalog/tours")
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
        Optional<Tour> tour = tourService.getTourById(id);
        return tour.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
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
}
