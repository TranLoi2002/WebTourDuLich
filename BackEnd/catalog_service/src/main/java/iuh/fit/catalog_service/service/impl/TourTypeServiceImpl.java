package iuh.fit.catalog_service.service.impl;

import com.netflix.discovery.converters.Auto;
import iuh.fit.catalog_service.model.Tour;
import iuh.fit.catalog_service.model.TourType;
import iuh.fit.catalog_service.repository.TourTypeRepository;
import iuh.fit.catalog_service.service.TourTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TourTypeServiceImpl implements TourTypeService {

    @Autowired
    private TourTypeRepository tourTypeRepository;

    @Override
    public List<TourType> getAllTourTypes() {
        return tourTypeRepository.findAll();
    }

    @Override
    public TourType getTourTypeById(Long id) {
        return tourTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TourType not found with id: " + id));
    }

    @Override
    public TourType createTourType(TourType tourType) {
        return tourTypeRepository.save(tourType);
    }

    @Override
    public TourType updateTourType(Long id, TourType tourTypeUpdate){
        return tourTypeRepository.findById(id)
                .map(existingTourType -> {
                    existingTourType.setName(tourTypeUpdate.getName());
                    existingTourType.setDescription(tourTypeUpdate.getDescription());
                    return tourTypeRepository.save(existingTourType);
                })
                .orElseThrow(() -> new RuntimeException("TourType not found with id: " + id));
    }

    @Override
    public void deleteTourType(Long id) {
        tourTypeRepository.deleteById(id);
    }

}
