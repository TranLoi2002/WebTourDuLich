package iuh.fit.se.catalogservice.controller;

import com.netflix.discovery.converters.Auto;
import iuh.fit.se.catalogservice.model.Tour;
import iuh.fit.se.catalogservice.model.TourType;
import iuh.fit.se.catalogservice.service.TourService;
import iuh.fit.se.catalogservice.service.TourTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping ("/api/catalog/tour-types")
public class TourTypeController {
    @Autowired
    private TourTypeService tourTypeService;

    @Autowired
    private TourService tourService;

    @GetMapping
    public ResponseEntity<List<TourType>> getAllTourTypes() {
        List<TourType> tourTypes = tourTypeService.getAllTourTypes();
        return ResponseEntity.ok(tourTypes);
    }

    @GetMapping("/{tourTypeId}/tours")
    public ResponseEntity<List<Tour>> getToursByTourType(@PathVariable Long tourTypeId) {
        List<Tour> tours = tourService.getToursByTourTypeId(tourTypeId);
        return ResponseEntity.ok(tours);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourType> getTourTypeById(@PathVariable Long id) {
        TourType tourType = tourTypeService.getTourTypeById(id);
        return ResponseEntity.ok(tourType);
    }

    @PostMapping
    public ResponseEntity<TourType> saveTourType(@RequestBody TourType tourType) {
        return ResponseEntity.ok(tourTypeService.createTourType(tourType));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<TourType> updateTourType(@PathVariable Long id, @RequestBody TourType updatedTourType) {
        if (id == null) {
            throw new IllegalArgumentException("The given id must not be null");
        }
        TourType updated = tourTypeService.updateTourType(id, updatedTourType);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTourType(@PathVariable Long id) {
        tourTypeService.deleteTourType(id);
        return ResponseEntity.noContent().build();
    }

}
