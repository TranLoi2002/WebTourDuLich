package iuh.fit.se.catalogservice.service.impl;

import com.netflix.discovery.converters.Auto;
import iuh.fit.se.catalogservice.model.ActivityType;
import iuh.fit.se.catalogservice.repository.ActivityTypeRepository;
import iuh.fit.se.catalogservice.service.ActivityTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityTypeServiceImpl implements ActivityTypeService {
    @Autowired
    private ActivityTypeRepository activityTypeRepository;


    @Override
    public List<ActivityType> getAllActivityTypes() {
        return activityTypeRepository.findAll();
    }

    @Override
    public ActivityType getActivityTypeById(Long id) {
        return activityTypeRepository.findById(id).orElse(null);
    }

    @Override
    public ActivityType saveActivityType(ActivityType activityType) {
        return activityTypeRepository.save(activityType);
    }

    @Override
    public ActivityType updateActivityType(Long id, ActivityType activityType) {
        return activityTypeRepository.findById(id)
                .map(existingActivityType -> {
                    existingActivityType.setName(activityType.getName());
                    return activityTypeRepository.save(existingActivityType);
                })
                .orElse(null);
    }

    @Override
    public void deleteActivityType(Long id) {
        activityTypeRepository.deleteById(id);
    }
}
