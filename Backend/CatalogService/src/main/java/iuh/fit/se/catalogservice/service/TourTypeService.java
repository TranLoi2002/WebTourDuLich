package iuh.fit.se.catalogservice.service;

import iuh.fit.se.catalogservice.model.Tour;
import iuh.fit.se.catalogservice.model.TourType;

import java.util.List;

public interface TourTypeService {
    List<TourType> getAllTourTypes();
    List<TourType> getTourTypesByIsActive(boolean isActive);
    TourType getTourTypeById(Long id);
    TourType createTourType(TourType tourType);
    TourType updateTourType(Long id, TourType tourTypeUpdate);
    void deleteTourType(Long id);

 }
