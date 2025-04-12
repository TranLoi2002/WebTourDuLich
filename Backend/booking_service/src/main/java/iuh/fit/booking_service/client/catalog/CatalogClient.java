package iuh.fit.booking_service.client.catalog;

import iuh.fit.booking_service.dto.TourDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "CATALOG-SERVICE", path = "/catalog/tours")
public interface CatalogClient {
    @GetMapping("/{id}")
    TourDTO getTourById(@PathVariable("id") Long id);
}

