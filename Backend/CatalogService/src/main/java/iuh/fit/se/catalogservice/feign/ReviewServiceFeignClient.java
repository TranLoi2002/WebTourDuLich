package iuh.fit.se.catalogservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

@FeignClient(name = "review-service", url = "http://localhost:8083/api/reviews")
public interface ReviewServiceFeignClient {
    @GetMapping("/tour/{tourId}/ratings")
    Map<String, Object> getTourRating(@PathVariable("tourId") Long tourId);

    @GetMapping("/tour/{tourId}")
    List<Map<String, Object>> getReviewsByTourId(@PathVariable("tourId") Long tourId);
}
