package iuh.fit.se.reviewservice.controller;

import iuh.fit.se.reviewservice.model.Review;
import iuh.fit.se.reviewservice.model.ReviewStatus;
import iuh.fit.se.reviewservice.repository.ReviewRepository;
import iuh.fit.se.reviewservice.service.ReviewService;
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
@RequestMapping("/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;
    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping
    public ResponseEntity<List<Review>> getAllReview() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Long id) {
        Optional<Review> review = reviewService.getReviewById(id);
        return review.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        return ResponseEntity.ok(reviewService.createReview(review));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Long id, @RequestBody Review review) {
        return ResponseEntity.ok(reviewService.updateReview(id, review));
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
