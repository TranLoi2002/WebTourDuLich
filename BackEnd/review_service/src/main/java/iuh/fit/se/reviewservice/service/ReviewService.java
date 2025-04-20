package iuh.fit.se.reviewservice.service;

import iuh.fit.se.reviewservice.model.Review;

import java.util.List;
import java.util.Optional;

public interface ReviewService {
    List<Review> getAllReviews();
    Optional<Review> getReviewById(Long id);
    Review addReview(Long userId, Long tourId, String content, List<String> imageUrls);
    List<Review> getReviewsByTourId(Long tourId);
//    Review updateReview(Long id, Review review);

    List<Review> getReviewByTourId(Long tourId);
}
