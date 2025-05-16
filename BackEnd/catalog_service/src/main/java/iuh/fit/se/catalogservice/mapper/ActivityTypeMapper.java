package iuh.fit.se.catalogservice.mapper;

import iuh.fit.se.catalogservice.dto.ActivityTypeDTO;
import iuh.fit.se.catalogservice.model.ActivityType;

public class ActivityTypeMapper {
    public static ActivityType toEntity(ActivityTypeDTO dto) {
        ActivityType activityType = new ActivityType();

        activityType.setName(dto.getName());

        return activityType;
    }
}
