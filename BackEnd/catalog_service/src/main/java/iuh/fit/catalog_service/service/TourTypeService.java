package iuh.fit.catalog_service.service;

import iuh.fit.catalog_service.model.Tour;
import iuh.fit.catalog_service.model.TourType;

import java.util.List;

public interface TourTypeService {
    List<TourType> getAllTourTypes();
    TourType getTourTypeById(Long id);
    TourType createTourType(TourType tourType);
    TourType updateTourType(Long id, TourType tourTypeUpdate);
    void deleteTourType(Long id);

 }
