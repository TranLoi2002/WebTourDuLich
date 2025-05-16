package iuh.fit.se.reviewservice.controller;

import iuh.fit.se.reviewservice.service.ReviewReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/review-replies")
public class ReviewReplyController {
    @Autowired
    private ReviewReplyService reviewReplyService;
}
