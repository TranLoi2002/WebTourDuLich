package iuh.fit.se.reviewservice.repository;

import iuh.fit.se.reviewservice.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long>{
}
