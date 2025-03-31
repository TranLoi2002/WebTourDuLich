package iuh.fit.se.catalogservice.service;

import iuh.fit.se.catalogservice.model.Tour;

import java.util.List;
import java.util.Optional;

public interface TourService {
    List<Tour> getAllTours();
    Optional<Tour> getTourById(Long id);
    Tour saveTour(Tour tour);
    Tour updateTour(Long id, Tour tour);
    void deleteTour(Long id);
}
