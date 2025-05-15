package iuh.fit.se.reviewservice.service.impl;

import iuh.fit.se.reviewservice.model.ReviewReply;
import iuh.fit.se.reviewservice.repository.ReviewReplyRepository;
import iuh.fit.se.reviewservice.service.ReviewReplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewReplyServiceImpl implements ReviewReplyService {
    @Autowired
    private ReviewReplyRepository reviewReplyRepository;

    @Override
    public ReviewReply addReviewReply(Long reviewId, Long userId, String content) {
        ReviewReply reply = new ReviewReply();
        reply.setReviewId(reviewId);
        reply.setUserId(userId);
        reply.setContent(content);
        reply.setCreatedAt(LocalDateTime.now());
        return reviewReplyRepository.save(reply);
    }

    @Override
    public List<ReviewReply> getReviewRepliesByReviewId(Long reviewId) {
        return reviewReplyRepository.findByReviewId(reviewId);
    }

    @Override
    public int countReviewRepliesByReviewId(Long reviewId) {
        return reviewReplyRepository.countByReviewId(reviewId);
    }
}
