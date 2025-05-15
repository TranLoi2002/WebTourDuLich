package iuh.fit.user_service.feign;

import iuh.fit.user_service.dto.TourDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "CATALOG-SERVICE", path = "/catalog/favourite-tours")
public interface CatalogFeignClient {
    // get favourite tour by user id
    @GetMapping("/user/{userId}")
    List<TourDTO> getFavouriteToursByUserId(@PathVariable("userId") Long userId);

    // add tour to favourite
    @PostMapping("/add")
    ResponseEntity<String> addFavouriteTour(@RequestParam Long userId, @RequestParam Long tourId);

    // remove tour from favourite
    @DeleteMapping("/delete")
    ResponseEntity<String> removeFavouriteTour(@RequestParam Long userId, @RequestParam Long tourId);

}
