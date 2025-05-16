package iuh.fit.se.catalogservice.controller;

import iuh.fit.se.catalogservice.dto.TourTypeDTO;
import iuh.fit.se.catalogservice.model.Tour;
import iuh.fit.se.catalogservice.model.TourType;
import iuh.fit.se.catalogservice.service.TourService;
import iuh.fit.se.catalogservice.service.TourTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping ("/catalog/tour-types")
public class TourTypeController {
    @Autowired
    private TourTypeService tourTypeService;

    @Autowired
    private TourService tourService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllTourTypes(@RequestParam Map<String, String> params) {
        Map<String, Object> response = tourTypeService.getAllTourTypes(params);
        return ResponseEntity.ok(response);
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
    public ResponseEntity<TourType> saveTourType(@Valid @RequestBody TourTypeDTO dto) {
        TourType createdTourType = tourTypeService.createTourType(dto);
        return ResponseEntity.status(201).body(createdTourType);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<TourType> updateTourType(@PathVariable Long id, @RequestBody TourTypeDTO dto) {
        if (id == null) {
            throw new IllegalArgumentException("The given id must not be null");
        }
        TourType updated = tourTypeService.updateTourType(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTourType(@PathVariable Long id) {
        tourTypeService.deleteTourType(id);
        return ResponseEntity.noContent().build();
    }

}
