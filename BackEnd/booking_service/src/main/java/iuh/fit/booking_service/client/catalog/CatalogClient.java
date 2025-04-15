package iuh.fit.booking_service.client.catalog;

import iuh.fit.booking_service.config.FeignConfig;
import iuh.fit.booking_service.dto.TourDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "CATALOG-SERVICE", path = "/catalog/tours", configuration = FeignConfig.class)
public interface CatalogClient {

    @GetMapping("/{id}")
    TourDTO getTourById(@PathVariable("id") Long id);

    @PutMapping(value = "/update/current-participants/{id}", consumes = "application/json")
    void updateCurrentParticipants(@PathVariable("id") Long id,
                                                      @RequestParam("currentParticipants") Integer currentParticipants);
}
