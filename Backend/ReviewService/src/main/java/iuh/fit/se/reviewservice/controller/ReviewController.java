package iuh.fit.se.reviewservice.controller;

import iuh.fit.se.reviewservice.model.Review;
import iuh.fit.se.reviewservice.repository.ReviewRepository;
import iuh.fit.se.reviewservice.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
}
