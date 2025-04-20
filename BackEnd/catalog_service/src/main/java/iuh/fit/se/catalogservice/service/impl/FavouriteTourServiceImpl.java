package iuh.fit.se.catalogservice.service.impl;

import iuh.fit.se.catalogservice.dto.TourDTO;
import iuh.fit.se.catalogservice.model.FavouriteTour;
import iuh.fit.se.catalogservice.model.Tour;
import iuh.fit.se.catalogservice.repository.FavouriteTourRepository;
import iuh.fit.se.catalogservice.repository.TourRepository;
import iuh.fit.se.catalogservice.service.FavouriteTourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavouriteTourServiceImpl implements FavouriteTourService {
    @Autowired
    private FavouriteTourRepository favouriteTourRepository;

    @Autowired
    private TourRepository tourRepository;

    @Override
    public List<TourDTO> getFavouriteTourByUserId(Long userId) {
        List<FavouriteTour> favs = favouriteTourRepository.findByUserId(userId);
        if (favs.isEmpty()) {
            System.out.println("User has no favourite tours" + userId);
        }
        return favs.stream()
                .map(fav -> {
                    Tour tour = fav.getTour();
                    TourDTO dto = new TourDTO();
                    dto.setId(tour.getId());
                    dto.setTourCode(tour.getTourCode());
                    dto.setTitle(tour.getTitle());
                    dto.setDescription(tour.getDescription());
                    dto.setHighlights(tour.getHighlights());
                    dto.setActivityTour(tour.isActivityTour());
                    dto.setPrice(tour.getPrice());
                    dto.setDiscount(tour.getDiscount());
                    dto.setPlaceOfDeparture(tour.getPlaceOfDeparture());
                    dto.setDuration(tour.getDuration());
                    dto.setStartDate(tour.getStartDate());
                    dto.setEndDate(tour.getEndDate());
                    dto.setMaxParticipants(tour.getMaxParticipants());
                    dto.setCurrentParticipants(tour.getCurrentParticipants());
                    dto.setThumbnail(tour.getThumbnail());
                    dto.setImages(tour.getImages());
//                    dto.setAverageRating(tour.getAverageRating()); // @Transient field
//                    dto.setTotalReviews(tour.getTotalReviews());   // @Transient field
                    dto.setLocationId(tour.getLocation().getId());
                    dto.setTourTypeId(tour.getTourType().getId());
//                    dto.setActivityTypeIds(
//                            tour.getActivityTypes().stream()
//                                    .map(activityType -> activityType.getId())
//                                    .collect(Collectors.toList()) // Convert to List<Long>
//                    );
                    return dto;
                })
                .collect(Collectors.toList());
    }


    @Override
    public void addTourToFavourite(Long userId, Long tourId) {
        if (favouriteTourRepository.existsByUserIdAndTourId(userId, tourId)) {
            throw new IllegalStateException("Tour is already in favourites");
        }
        FavouriteTour favouriteTour = new FavouriteTour();
        favouriteTour.setUserId(userId);
        favouriteTour.setTour(tourRepository.findById(tourId)
                .orElseThrow(() -> new IllegalArgumentException("Tour not found")));
        favouriteTourRepository.save(favouriteTour);
    }

    @Override
    public void removeTourFromFavourite(Long userId, Long tourId) {
        FavouriteTour favouriteTour = favouriteTourRepository.findByUserIdAndTourId(userId, tourId);

        favouriteTourRepository.delete(favouriteTour);
    }
}
