package iuh.fit.catalog_service.service;

import iuh.fit.catalog_service.model.ActivityType;

import java.util.List;

public interface ActivityTypeService {
    List<ActivityType> getAllActivityTypes();
    ActivityType getActivityTypeById(Long id);
    ActivityType saveActivityType(ActivityType activityType);
    ActivityType updateActivityType(Long id, ActivityType activityType);
    void deleteActivityType(Long id);
}
