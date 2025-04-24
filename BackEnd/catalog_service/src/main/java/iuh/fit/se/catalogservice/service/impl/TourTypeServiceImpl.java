package iuh.fit.se.catalogservice.service.impl;

import com.netflix.discovery.converters.Auto;
import iuh.fit.se.catalogservice.dto.TourTypeDTO;
import iuh.fit.se.catalogservice.mapper.LocationMapper;
import iuh.fit.se.catalogservice.mapper.TourTypeMapper;
import iuh.fit.se.catalogservice.model.Location;
import iuh.fit.se.catalogservice.model.Tour;
import iuh.fit.se.catalogservice.model.TourType;
import iuh.fit.se.catalogservice.repository.TourTypeRepository;
import iuh.fit.se.catalogservice.service.TourTypeService;
import iuh.fit.se.catalogservice.util.PaginationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class TourTypeServiceImpl implements TourTypeService {

    @Autowired
    private TourTypeRepository tourTypeRepository;

    @Override
    public Map<String, Object> getAllTourTypes(Map<String, String> params) {
        Pageable pageable = PaginationUtil.createPageable(params);
        Page<TourType> page = tourTypeRepository.findAll(pageable);

        return PaginationUtil.createResponse(page);
    }

    @Override
    public List<TourType> getTourTypesByIsActive(boolean isActive) {
        return tourTypeRepository.findByIsActive(isActive);
    }

    @Override
    public TourType getTourTypeById(Long id) {
        return tourTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TourType not found with id: " + id));
    }

    @Override
    public TourType createTourType(TourTypeDTO dto) {
        TourType tourType = TourTypeMapper.toEntity(dto);

        return tourTypeRepository.save(tourType);
    }

    @Override
    public TourType updateTourType(Long id, TourTypeDTO dto){
        TourType existing = tourTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found with id " + id));

        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());

        return tourTypeRepository.save(existing);
    }

    @Override
    public void deleteTourType(Long id) {
        TourType tourType = getTourTypeById(id);
        if (tourType != null) {
            tourType.setActive(false);
            tourTypeRepository.save(tourType);
        }
    }

}
