package iuh.fit.se.reviewservice.service;

import iuh.fit.se.reviewservice.model.Review;

import java.util.List;
import java.util.Optional;

public interface ReviewService {
    List<Review> getAllReviews();
    Optional<Review> getReviewById(Long id);
    Review createReview(Review review);
    Review updateReview(Long id, Review review);
    void deleteReview(Long id);

    List<Review> getReviewByTourId(Long tourId);
}
