package iuh.fit.review_service.repository;

import iuh.fit.review_service.model.Review;
import iuh.fit.review_service.model.ReviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long>{
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.tourId = :tourId AND r.status = 'APPROVED'")
    Double findAverageRatingByTourId(@Param("tourId") Long tourId);

    Long countByTourIdAndStatus(Long tourId, ReviewStatus status);

    List<Review> findByTourIdAndStatus(Long tourId, ReviewStatus status);
}
