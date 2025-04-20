package iuh.fit.se.catalogservice.service;

import iuh.fit.se.catalogservice.model.ActivityType;

import java.util.List;

public interface ActivityTypeService {
    List<ActivityType> getAllActivityTypes();
    List<ActivityType> getActivityTypesByIsActive(boolean isActive);
    ActivityType getActivityTypeById(Long id);
    ActivityType saveActivityType(ActivityType activityType);
    ActivityType updateActivityType(Long id, ActivityType activityType);
    void deleteActivityType(Long id);
}
