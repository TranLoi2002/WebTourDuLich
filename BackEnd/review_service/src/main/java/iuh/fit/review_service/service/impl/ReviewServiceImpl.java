package iuh.fit.review_service.service.impl;

import iuh.fit.review_service.model.Review;
import iuh.fit.review_service.repository.ReviewRepository;
import iuh.fit.review_service.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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
    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    @Override
    public Review updateReview(Long id, Review review) {
       return reviewRepository.findById(id)
                .map(oldReview -> {
                    oldReview.setTourId(review.getTourId());
                    oldReview.setUserId(review.getUserId());
                    oldReview.setRating(review.getRating());
                    oldReview.setComment(review.getComment());
                    oldReview.setImages(review.getImages());
                    oldReview.setCreatedAt(review.getCreatedAt());
                    oldReview.setUpdatedAt(review.getUpdatedAt());
                    oldReview.setStatus(review.getStatus());

                    return reviewRepository.save(oldReview);
                }).orElseThrow(() -> new RuntimeException("Review not found with id " + id));

    }

    @Override
    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    @Override
    public List<Review> getReviewByTourId(Long tourId) {
        String reviewServiceUrl = "http://localhost:8083/review-service/api/reviews/tour/" + tourId;
        ResponseEntity<List> response = restTemplate.getForEntity(reviewServiceUrl, List.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            return response.getBody();
        }
        return List.of();
    }


}
