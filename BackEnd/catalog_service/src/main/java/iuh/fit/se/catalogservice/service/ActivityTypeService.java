package iuh.fit.se.catalogservice.service;

import iuh.fit.se.catalogservice.dto.ActivityTypeDTO;
import iuh.fit.se.catalogservice.model.ActivityType;

import java.util.List;
import java.util.Map;

public interface ActivityTypeService {
    Map<String, Object> getAllActivityTypes(Map<String, String> params);
    List<ActivityType> getActivityTypesByIsActive(boolean isActive);
    ActivityType getActivityTypeById(Long id);
    ActivityType saveActivityType(ActivityTypeDTO dto);
    ActivityType updateActivityType(Long id, ActivityTypeDTO activityType);
    void deleteActivityType(Long id);
}
