package iuh.fit.se.catalogservice.service;

import iuh.fit.se.catalogservice.model.Tour;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface TourService {
    List<Tour> getAllTours();
    List<Tour> getTourByIsActive(boolean isActive);
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

    List<Tour> getRelatedToursByLocationId(Long locationId, Long excludeTourId, Pageable pageable);
}

