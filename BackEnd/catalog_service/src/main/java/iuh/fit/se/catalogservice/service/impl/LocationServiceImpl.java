package iuh.fit.se.catalogservice.service.impl;

import iuh.fit.se.catalogservice.dto.LocationDTO;
import iuh.fit.se.catalogservice.mapper.LocationMapper;
import iuh.fit.se.catalogservice.mapper.TourMapper;
import iuh.fit.se.catalogservice.model.Location;
import iuh.fit.se.catalogservice.model.Tour;
import iuh.fit.se.catalogservice.repository.LocationRepository;
import iuh.fit.se.catalogservice.service.LocationService;
import iuh.fit.se.catalogservice.util.PaginationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class LocationServiceImpl implements LocationService {
    @Autowired
    private LocationRepository locationRepository;

    public LocationServiceImpl() {
        super();
    }

    @Override
    public Map<String, Object> getAllLocations(Map<String, String> params) {
        Pageable pageable = PaginationUtil.createPageable(params);
        Page<Location> page = locationRepository.findAll(pageable);

        return PaginationUtil.createResponse(page);
    }

    @Override
    public List<Location> getLocationsByIsActive(boolean isActive) {
        return locationRepository.findByIsActive(isActive);
    }

    @Override
    public Location getLocationById(Long id) {
        return locationRepository.findById(id).orElse(null);
    }

    @Override
    public Location saveLocation(LocationDTO dto) {
        Location location = LocationMapper.toEntity(dto);

        return locationRepository.save(location);
    }

    @Override
    public Location updateLocation(Long id, LocationDTO dto) {
        Location existinglocation = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found with id " + id));

        existinglocation.setName(dto.getName());
        existinglocation.setDescription(dto.getDescription());
        existinglocation.setImageUrl(dto.getImgUrl());
        existinglocation.setType(dto.getType());

        return locationRepository.save(existinglocation);
    }

    @Override
    public void deleteLocation(Long id) {
        Location location = getLocationById(id);
        if(location != null){
            location.setActive(false);
            locationRepository.save(location);
        }
    }
}
