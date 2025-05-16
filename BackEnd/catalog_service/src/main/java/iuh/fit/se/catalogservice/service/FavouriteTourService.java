package iuh.fit.se.catalogservice.service;

import iuh.fit.se.catalogservice.dto.TourDTO;

import java.util.List;

public interface FavouriteTourService {
    // get Favourite tour by user id
    List<TourDTO> getFavouriteTourByUserId(Long userId);

    // add tour to favourite
    void addTourToFavourite(Long userId, Long tourId);

    // remove tour from favourite
    void removeTourFromFavourite(Long userId, Long tourId);
}
