package iuh.fit.catalog_service.service;

import iuh.fit.catalog_service.model.Tour;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface TourService {
    List<Tour> getAllTours();
//    Optional<Tour> getTourById(Long id);
    Tour saveTour(Tour tour);
    Tour updateTour(Long id, Tour tour);
    void deleteTour(Long id);
    List<Tour> getToursByTourTypeId(Long tourTypeId);

    List<Tour> getToursByActivityType(String activityTypeName);

    Optional<Tour> getTourByIdWithRating(Long id);

    List<Map<String, Object>> getReviewsByTourId(Long tourId);

    List<Tour> getToursByLocationId(Long locationId);
    Tour updateCurrentParticipants(Long id, Integer currentParticipants);

}
