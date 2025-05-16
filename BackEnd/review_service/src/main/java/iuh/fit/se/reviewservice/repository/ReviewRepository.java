package iuh.fit.se.reviewservice.repository;

import iuh.fit.se.reviewservice.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long>{
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.tourId = :tourId")
    Double findAverageRatingByTourId(@Param("tourId") Long tourId);

    Long countByTourId(Long tourId);

//    List<Review> findByTourIdAndStatus(Long tourId);

    @Query("SELECT r FROM Review r WHERE r.tourId = :tourId")
    Page<Review> findByTourId(Long tourId, Pageable pageable);
}
