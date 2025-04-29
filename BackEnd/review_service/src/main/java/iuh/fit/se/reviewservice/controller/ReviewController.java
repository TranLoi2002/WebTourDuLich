package iuh.fit.se.reviewservice.controller;

import iuh.fit.se.reviewservice.model.Review;
import iuh.fit.se.reviewservice.model.ReviewReply;
import iuh.fit.se.reviewservice.repository.ReviewRepository;
import iuh.fit.se.reviewservice.service.ReviewReplyService;
import iuh.fit.se.reviewservice.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
    private ReviewReplyService reviewReplyService;

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
    @PostMapping("/tour/{tourId}/add")
    public ResponseEntity<Review> addReview(
            @PathVariable Long tourId,
            @RequestBody Map<String, Object> payload,
            @RequestHeader("userId") Long userId) {
        if (userId == null) {
            return ResponseEntity.status(401).body(null); // Unauthorized
        }
        String content = (String) payload.get("comment");
        List<String> imageUrls = (List<String>) payload.get("images");
        int rating = (int) payload.get("rating");
        Review review = reviewService.addReview(userId, tourId, content, imageUrls,rating);
        return ResponseEntity.ok(review);
    }

//    @PutMapping("/update/{id}")
//    public ResponseEntity<Review> updateReview(@PathVariable Long id, @RequestBody Review review) {
//        return ResponseEntity.ok(reviewService.updateReview(id, review));
//    }

    // get rating by tour
    @GetMapping("/tour/{tourId}/ratings")
    public ResponseEntity<?> getTourRating(@PathVariable Long tourId){
        Double averageRating = reviewRepository.findAverageRatingByTourId(tourId);
        Long totalReviews = reviewRepository.countByTourId(tourId);

        Map<String, Object> response = new HashMap<>();
        response.put("averageRating", averageRating != null ? averageRating : 0.0);
        response.put("totalReviews", totalReviews);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/tour/{tourId}")
    public ResponseEntity<?> getReviewsByTourId(@PathVariable Long tourId, @RequestParam(defaultValue = "0" ) int page, @RequestParam(defaultValue ="5") int size) {
        if (page < 0 || size <= 0) {
            return ResponseEntity.badRequest().body(null); // Invalid pagination parameters
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());

        Page<Review> reviews = reviewService.getReviewsByTourId(tourId, pageable);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/{reviewId}/reply")
    public ResponseEntity<ReviewReply> addReply(
            @PathVariable Long reviewId,
            @RequestBody Map<String, Object> payload,
            @RequestHeader("userId") Long userId) {
        if (userId == null) {
            return ResponseEntity.status(401).body(null); // Unauthorized
        }
        String content = (String) payload.get("content");
        ReviewReply reply = reviewReplyService.addReviewReply(reviewId, userId, content);
        return ResponseEntity.ok(reply);
    }

    @GetMapping("/reply/{reviewId}")
    public ResponseEntity<List<ReviewReply>> getRepliesByReviewId(@PathVariable Long reviewId) {
        List<ReviewReply> replies = reviewReplyService.getReviewRepliesByReviewId(reviewId);
        return ResponseEntity.ok(replies);
    }

    @PostMapping("/{reviewId}/images")
    public ResponseEntity<?> uploadReviewImages(
            @PathVariable Long reviewId,
            @RequestParam("images") List<MultipartFile> imageUrls) {
        try {
            List<String> uploadedurls = reviewService.saveReviewImages(reviewId, imageUrls);
            return ResponseEntity.ok(uploadedurls);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to upload images.");
        }
    }

    @GetMapping("/{reviewId}/reply/count")
    public ResponseEntity<Integer> countReviewReplies(@PathVariable Long reviewId) {
        int count = reviewReplyService.countReviewRepliesByReviewId(reviewId);
        return ResponseEntity.ok(count);
    }

}
