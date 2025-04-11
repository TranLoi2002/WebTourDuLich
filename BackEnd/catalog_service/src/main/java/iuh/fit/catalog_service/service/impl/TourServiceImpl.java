package iuh.fit.catalog_service.service.impl;

import com.netflix.discovery.converters.Auto;
import iuh.fit.catalog_service.model.Tour;
import iuh.fit.catalog_service.repository.TourRepository;
import iuh.fit.catalog_service.repository.TourTypeRepository;
import iuh.fit.catalog_service.service.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class TourServiceImpl implements TourService {
    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private RestTemplate restTemplate;

    public TourServiceImpl() {
        super();
    }

    @Override
    public int hashCode() {
        return super.hashCode();
    }

    @Override
    public List<Tour> getAllTours() {
        return tourRepository.findAll();
    }

//    @Override
//    public Optional<Tour> getTourById(Long id) {
//        return tourRepository.findById(id);
//    }

    @Override
    public Tour saveTour(Tour tour) {
        return tourRepository.save(tour);
    }

    @Override
    public Tour updateTour(Long id, Tour tour) {
        return tourRepository.findById(id)
                .map(existingTour -> {
                    existingTour.setTitle(tour.getTitle());
                    existingTour.setDescription(tour.getDescription());
                    existingTour.setPrice(tour.getPrice());
                    existingTour.setDuration(tour.getDuration());
                    existingTour.setStartDate(tour.getStartDate());
                    existingTour.setEndDate(tour.getEndDate());
                    existingTour.setMaxParticipants(tour.getMaxParticipants());
                    existingTour.setCurrentParticipants(tour.getCurrentParticipants());
                    existingTour.setThumbnail(tour.getThumbnail());
                    existingTour.setImages(tour.getImages());
                    existingTour.setActive(tour.isActive());
                    existingTour.setActivityTour(tour.isActivityTour());

                    existingTour.setTourCode(tour.getTourCode());
                    existingTour.setHighlights(tour.getHighlights() != null ? tour.getHighlights() : existingTour.getHighlights());
//                    existingTour.setNotes(tour.getNotes());
                    existingTour.setPlaceOfDeparture(tour.getPlaceOfDeparture());
                    existingTour.setDiscount(tour.getDiscount());

                    if(tour.getTourType() != null) {
                        existingTour.setTourType(tour.getTourType());
                    } else {
                        throw new IllegalArgumentException("Tour type must not be null");
                    }

                    if (tour.getLocation() != null) {
                        existingTour.setLocation(tour.getLocation());
                    } else {
                        throw new IllegalArgumentException("Location must not be null");
                    }
                    return tourRepository.save(existingTour);
                }).orElseThrow(() -> new RuntimeException("Tour not found with id " + id));
    }

    @Override
    public void deleteTour(Long id) {
        tourRepository.deleteById(id);
    }

    @Override
    public List<Tour> getToursByTourTypeId(Long tourTypeId) {
        return tourRepository.findByTourTypeId(tourTypeId);
    }

    @Override
    public List<Tour> getToursByActivityType(String activityTypeName) {
        return tourRepository.findToursByActivityType(activityTypeName);
    }

    @Override
    public Optional<Tour> getTourByIdWithRating(Long id) {
        Optional<Tour> tour = tourRepository.findById(id);

        if (tour.isPresent()) {
//            http://localhost:8083/review-service/api/reviews/tour/1/ratings
            String reviewServiceUrl = "http://localhost:8084/api/reviews/tour/" + id + "/ratings";
            ResponseEntity<Map> response = restTemplate.getForEntity(reviewServiceUrl, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> ratings = response.getBody();
                tour.get().setAverageRating((Double) ratings.get("averageRating"));
                tour.get().setTotalReviews(((Number) ratings.get("totalReviews")).longValue());
            }
        }

        return tour;
    }


    // File: Backend/CatalogService/src/main/java/iuh/fit/se/catalogservice/service/impl/TourServiceImpl.java
    @Override
    public List<Map<String, Object>> getReviewsByTourId(Long tourId) {
        String reviewServiceUrl = "http://localhost:8083/review-service/api/reviews/tour/" + tourId;
        ResponseEntity<List> response = restTemplate.getForEntity(reviewServiceUrl, List.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            return response.getBody();
        }
        return List.of();
    }

    @Override
    public List<Tour> getToursByLocationId(Long locationId) {
        return tourRepository.getToursByLocationId(locationId);
    }
}
