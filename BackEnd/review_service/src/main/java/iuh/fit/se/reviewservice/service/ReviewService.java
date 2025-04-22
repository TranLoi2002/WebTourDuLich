package iuh.fit.se.reviewservice.service;

import iuh.fit.se.reviewservice.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface ReviewService {
    List<Review> getAllReviews();
    Optional<Review> getReviewById(Long id);
    Review addReview(Long userId, Long tourId, String content, List<String> imageUrls, int rating);
    Page<Review> getReviewsByTourId(Long tourId, Pageable pageable);
//    Review updateReview(Long id, Review review);

    List<Review> getReviewByTourId(Long tourId);

    List<String> saveReviewImages(Long reviewId, List<MultipartFile> images);

}
