package iuh.fit.se.catalogservice.controller;

import iuh.fit.se.catalogservice.model.ActivityType;
import iuh.fit.se.catalogservice.service.ActivityTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/catalog/activity-types")
public class ActivityTypeController {
    @Autowired
    private ActivityTypeService activityTypeService;

    @GetMapping
    public ResponseEntity<List<ActivityType>> getAllActivityTypes() {
        List<ActivityType> activityTypes = activityTypeService.getAllActivityTypes();
        return ResponseEntity.ok(activityTypes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActivityType> getActivityTypeById(@PathVariable Long id) {
        ActivityType activityType = activityTypeService.getActivityTypeById(id);
        return activityType != null ? ResponseEntity.ok(activityType) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<ActivityType> saveActivityType(@RequestBody ActivityType activityType) {
        ActivityType savedActivityType = activityTypeService.saveActivityType(activityType);
        return ResponseEntity.ok(savedActivityType);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ActivityType> updateActivityType(@PathVariable Long id, @RequestBody ActivityType activityType) {
        ActivityType updatedActivityType = activityTypeService.updateActivityType(id, activityType);
        return updatedActivityType != null ? ResponseEntity.ok(updatedActivityType) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivityType(@PathVariable Long id) {
        activityTypeService.deleteActivityType(id);
        return ResponseEntity.noContent().build();
    }
}
