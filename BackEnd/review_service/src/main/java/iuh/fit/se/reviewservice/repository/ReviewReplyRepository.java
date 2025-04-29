package iuh.fit.se.reviewservice.repository;

import iuh.fit.se.reviewservice.model.ReviewReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewReplyRepository extends JpaRepository<ReviewReply, Long> {
    List<ReviewReply> findByReviewId(Long reviewId);

    // get count review reply by review id
    @Query(nativeQuery = true, value = "SELECT COUNT(*) FROM review_replies WHERE review_id = :reviewId")
    int countByReviewId(Long reviewId);
}
