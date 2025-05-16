package iuh.fit.se.catalogservice.service;

import iuh.fit.se.catalogservice.dto.TourTypeDTO;
import iuh.fit.se.catalogservice.model.TourType;

import java.util.List;
import java.util.Map;

public interface TourTypeService {
    Map<String, Object> getAllTourTypes(Map<String, String> params);
    List<TourType> getTourTypesByIsActive(boolean isActive);
    TourType getTourTypeById(Long id);
    TourType createTourType(TourTypeDTO dto);
    TourType updateTourType(Long id, TourTypeDTO dto);
    void deleteTourType(Long id);

 }
