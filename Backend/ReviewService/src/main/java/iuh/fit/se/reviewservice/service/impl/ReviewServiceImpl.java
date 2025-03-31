package iuh.fit.se.reviewservice.service.impl;

import iuh.fit.se.reviewservice.model.Review;
import iuh.fit.se.reviewservice.repository.ReviewRepository;
import iuh.fit.se.reviewservice.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewServiceImpl implements ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

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
}
