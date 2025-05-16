package iuh.fit.se.reviewservice.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import iuh.fit.se.reviewservice.model.Review;
import iuh.fit.se.reviewservice.repository.ReviewRepository;
import iuh.fit.se.reviewservice.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ReviewServiceImpl implements ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private Cloudinary cloudinary;

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
    public Review addReview(Long userId, Long tourId, String content, List<String> imageUrls, int rating) {
        Review review = new Review();
        review.setUserId(userId);
        review.setTourId(tourId);
        review.setComment(content);
        review.setImages(imageUrls);
        review.setRating(rating);
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    @Override
    public Page<Review> getReviewsByTourId(Long tourId, Pageable pageable) {
        return reviewRepository.findByTourId(tourId, pageable);
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


    // upload img cloudinary : https://res.cloudinary.com/dzwjgfd7t/image/upload/v1744339813/booking/photo-1672578918034-5e164fe5b7dc_in5ytj.avif
    @Override
    public List<String> saveReviewImages(Long reviewId, List<MultipartFile> images) {
        // Validate reviewId
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));

        List<String> imageUrls = new ArrayList<>();

        try {
            // Upload each image to Cloudinary
            for (MultipartFile image : images) {
                System.out.println("Uploading image: " + image.getOriginalFilename());
                Map uploadResult = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.asMap(
                        "folder", "booking", // Specify the folder
                        "use_filename", true, // Use the original file name
                        "unique_filename", true // Ensure unique file names
                ));
                System.out.println("Upload result: " + uploadResult); // Debugging line
                String imageUrl = (String) uploadResult.get("secure_url");
                imageUrls.add(imageUrl);
            }

            // Update review with the list of image URLs
            review.setImages(imageUrls);
            reviewRepository.save(review);

            return imageUrls; // Return the list of image URLs

        } catch (Exception e) {
            e.printStackTrace(); // In ra stacktrace lỗi để debug
            throw new RuntimeException("Failed to upload images to Cloudinary", e);
        }
    }


}
