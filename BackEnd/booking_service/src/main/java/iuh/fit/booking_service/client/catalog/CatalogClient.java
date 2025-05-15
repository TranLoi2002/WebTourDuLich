package iuh.fit.booking_service.client.catalog;

import iuh.fit.booking_service.config.FeignConfig;
import iuh.fit.booking_service.dto.LightTourDTO;
import iuh.fit.booking_service.dto.TourDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@FeignClient(name = "CATALOG-SERVICE", path = "/catalog/tours", configuration = FeignConfig.class)
public interface CatalogClient {

    @GetMapping("/{id}")
    LightTourDTO getTourById(@PathVariable("id") Long id);
<<<<<<< HEAD

=======
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f

    @PutMapping(value = "/update/current-participants/{id}", consumes = "application/json")
    void updateCurrentParticipants(@PathVariable("id") Long id,
                                   @RequestBody Map<String, Integer> requestBody);
}