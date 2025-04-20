package iuh.fit.se.reviewservice.service.impl;

import iuh.fit.se.reviewservice.model.Review;
import iuh.fit.se.reviewservice.repository.ReviewRepository;
import iuh.fit.se.reviewservice.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewServiceImpl implements ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private RestTemplate restTemplate;

    public ReviewServiceImpl() {
        super();
    }

    @Override
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @Override
    public Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

    @Override
    public Review addReview(Long userId, Long tourId, String content, List<String> imageUrls) {
        Review review = new Review();
        review.setUserId(userId);
        review.setTourId(tourId);
        review.setComment(content);
        review.setImages(imageUrls);
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getReviewsByTourId(Long tourId) {
        return reviewRepository.findByTourId(tourId);
    }



//    @Override
//    public Review updateReview(Long id, Review review) {
//       return reviewRepository.findById(id)
//                .map(oldReview -> {
//                    oldReview.setTourId(review.getTourId());
//                    oldReview.setUserId(review.getUserId());
//                    oldReview.setRating(review.getRating());
//                    oldReview.setComment(review.getComment());
//                    oldReview.setImages(review.getImages());
//                    oldReview.setCreatedAt(review.getCreatedAt());
//                    oldReview.setUpdatedAt(review.getUpdatedAt());
////                    oldReview.setStatus(review.getStatus());
//
//                    return reviewRepository.save(oldReview);
//                }).orElseThrow(() -> new RuntimeException("Review not found with id " + id));
//
//    }

    @Override
    public List<Review> getReviewByTourId(Long tourId) {
        String reviewServiceUrl = "http://localhost:8083/api/reviews/tour/" + tourId;
        ResponseEntity<List> response = restTemplate.getForEntity(reviewServiceUrl, List.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            return response.getBody();
        }
        return List.of();
    }


}
