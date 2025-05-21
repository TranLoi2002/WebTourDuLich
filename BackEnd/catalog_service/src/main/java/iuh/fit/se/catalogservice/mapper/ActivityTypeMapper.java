package iuh.fit.se.catalogservice.mapper;

import iuh.fit.se.catalogservice.dto.ActivityTypeDTO;
import iuh.fit.se.catalogservice.dto.TourTypeDTO;
import iuh.fit.se.catalogservice.model.ActivityType;
import iuh.fit.se.catalogservice.model.TourType;

public class ActivityTypeMapper {
    public static ActivityType toEntity(ActivityTypeDTO dto) {
        ActivityType activityType = new ActivityType();

        activityType.setName(dto.getName());

        return activityType;
    }
}
