package iuh.fit.se.catalogservice.controller;

import com.netflix.discovery.converters.Auto;
import iuh.fit.se.catalogservice.dto.TourDTO;
import iuh.fit.se.catalogservice.model.Tour;
import iuh.fit.se.catalogservice.service.FavouriteTourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalog/favourite-tours")
public class FavouriteTourController {
    @Autowired
    private FavouriteTourService favouriteTourService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TourDTO>> getFavouriteTourByUserId(@PathVariable Long userId) {
        List<TourDTO> favouriteTours = favouriteTourService.getFavouriteTourByUserId(userId);
        return ResponseEntity.ok(favouriteTours);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addTourToFavourite(@RequestParam Long userId, @RequestParam Long tourId) {
        try {
            favouriteTourService.addTourToFavourite(userId, tourId);
            return ResponseEntity.ok("Tour added to favourites successfully!");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> removeTourFromFavourite(@RequestParam Long userId, @RequestParam Long tourId) {
        favouriteTourService.removeTourFromFavourite(userId, tourId);
        return ResponseEntity.ok("Tour removed from favourites successfully");
    }

}
