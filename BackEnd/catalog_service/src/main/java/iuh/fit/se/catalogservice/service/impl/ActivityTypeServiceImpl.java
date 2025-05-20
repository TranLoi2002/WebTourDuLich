package iuh.fit.se.catalogservice.service.impl;

import com.netflix.discovery.converters.Auto;
import iuh.fit.se.catalogservice.dto.ActivityTypeDTO;
import iuh.fit.se.catalogservice.mapper.ActivityTypeMapper;
import iuh.fit.se.catalogservice.mapper.LocationMapper;
import iuh.fit.se.catalogservice.model.ActivityType;
import iuh.fit.se.catalogservice.model.Location;
import iuh.fit.se.catalogservice.repository.ActivityTypeRepository;
import iuh.fit.se.catalogservice.service.ActivityTypeService;
import iuh.fit.se.catalogservice.util.PaginationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ActivityTypeServiceImpl implements ActivityTypeService {
    @Autowired
    private ActivityTypeRepository activityTypeRepository;


    @Override
    public Map<String, Object> getAllActivityTypes(Map<String, String> params) {
        Pageable pageable = PaginationUtil.createPageable(params);
        Page<ActivityType> page = activityTypeRepository.findAll(pageable);

        return PaginationUtil.createResponse(page);
    }

    @Override
    public List<ActivityType> getActivityTypesByIsActive(boolean isActive) {
        return activityTypeRepository.findByIsActive(isActive);
    }

    @Override
    public ActivityType getActivityTypeById(Long id) {
        return activityTypeRepository.findById(id).orElse(null);
    }

    @Override
    public ActivityType saveActivityType(ActivityTypeDTO dto) {
        ActivityType activityType = ActivityTypeMapper.toEntity(dto);

        return activityTypeRepository.save(activityType);
    }

    @Override
    public ActivityType updateActivityType(Long id, ActivityTypeDTO dto) {
        ActivityType existing = activityTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found with id " + id));

        existing.setName(dto.getName());

        return activityTypeRepository.save(existing);
    }

    @Override
    public void deleteActivityType(Long id) {
        ActivityType activityType = getActivityTypeById(id);
        if (activityType != null) {
            // change active when
            if(activityType.isActive()) {
                activityType.setActive(false);
            } else {
                activityType.setActive(true);
            }
            activityTypeRepository.save(activityType);
        }
    }
}
