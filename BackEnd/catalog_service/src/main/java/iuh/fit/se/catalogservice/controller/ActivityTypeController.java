package iuh.fit.se.catalogservice.controller;

import iuh.fit.se.catalogservice.dto.ActivityTypeDTO;
import iuh.fit.se.catalogservice.model.ActivityType;
import iuh.fit.se.catalogservice.service.ActivityTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/catalog/activity-types")
public class ActivityTypeController {
    @Autowired
    private ActivityTypeService activityTypeService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllActivityTypes(@RequestParam Map<String, String> params) {
        Map<String, Object> response = activityTypeService.getAllActivityTypes(params);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActivityType> getActivityTypeById(@PathVariable Long id) {
        ActivityType activityType = activityTypeService.getActivityTypeById(id);
        return activityType != null ? ResponseEntity.ok(activityType) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<ActivityType> saveActivityType(@Valid @RequestBody ActivityTypeDTO dto) {
        ActivityType savedActivityType = activityTypeService.saveActivityType(dto);
        return ResponseEntity.ok(savedActivityType);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ActivityType> updateActivityType(@PathVariable Long id, @RequestBody ActivityTypeDTO dto) {
        ActivityType updatedActivityType = activityTypeService.updateActivityType(id, dto);
        return updatedActivityType != null ? ResponseEntity.ok(updatedActivityType) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivityType(@PathVariable Long id) {
        activityTypeService.deleteActivityType(id);
        return ResponseEntity.noContent().build();
    }
}
