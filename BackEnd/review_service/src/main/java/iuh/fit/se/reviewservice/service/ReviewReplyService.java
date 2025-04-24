package iuh.fit.se.reviewservice.service;

import iuh.fit.se.reviewservice.model.ReviewReply;

import java.util.List;

public interface ReviewReplyService {
    ReviewReply addReviewReply(Long reviewId, Long userId, String content);
    List<ReviewReply> getReviewRepliesByReviewId(Long reviewId);

    int countReviewRepliesByReviewId(Long reviewId);
}
