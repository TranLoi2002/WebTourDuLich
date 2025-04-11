package iuh.fit.review_service.controller;

import iuh.fit.review_service.model.Review;
import iuh.fit.review_service.model.ReviewStatus;
import iuh.fit.review_service.repository.ReviewRepository;
import iuh.fit.review_service.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;
    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping
    public ResponseEntity<List<Review>> getAllTour() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Review> getTourById(@PathVariable Long id) {
        Optional<Review> review = reviewService.getReviewById(id);
        return review.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping
    public ResponseEntity<Review> createTour(@RequestBody Review review) {
        return ResponseEntity.ok(reviewService.createReview(review));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> updateTour(@PathVariable Long id, @RequestBody Review review) {
        return ResponseEntity.ok(reviewService.updateReview(id, review));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTour(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    // get rating by tour
    @GetMapping("/tour/{tourId}/ratings")
    public ResponseEntity<?> getTourRating(@PathVariable Long tourId){
        Double averageRating = reviewRepository.findAverageRatingByTourId(tourId);
        Long totalReviews = reviewRepository.countByTourIdAndStatus(tourId, ReviewStatus.APPROVED);

        Map<String, Object> response = new HashMap<>();
        response.put("averageRating", averageRating != null ? averageRating : 0.0);
        response.put("totalReviews", totalReviews);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/tour/{tourId}")
    public ResponseEntity<List<Review>> getReviewsByTourId(@PathVariable Long tourId) {
        List<Review> reviews = reviewRepository.findByTourIdAndStatus(tourId, ReviewStatus.APPROVED);
        return ResponseEntity.ok(reviews);
    }

}
