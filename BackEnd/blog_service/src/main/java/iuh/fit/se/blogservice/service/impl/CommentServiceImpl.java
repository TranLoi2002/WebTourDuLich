package iuh.fit.se.blogservice.service.impl;

import iuh.fit.se.blogservice.dto.CommentDTO;
import iuh.fit.se.blogservice.dto.UserResponse;
import iuh.fit.se.blogservice.feign.UserServiceClient;
import iuh.fit.se.blogservice.model.Blog;
import iuh.fit.se.blogservice.model.Comment;
import iuh.fit.se.blogservice.repository.BlogRepository;
import iuh.fit.se.blogservice.repository.CommentRepository;
import iuh.fit.se.blogservice.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private UserServiceClient userServiceClient;

    @Override
    public CommentDTO createComment(Long blogId, CommentDTO commentDTO) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + blogId));

        // Validation
        if (commentDTO.getContent() == null || commentDTO.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Content is required");
        }

        // Tạo Comment entity
        Comment comment = new Comment();
        comment.setContent(commentDTO.getContent());
        comment.setUserId(commentDTO.getUserId());
        comment.setBlog(blog);

        // Lưu Comment
        Comment savedComment = commentRepository.save(comment);

        // Ánh xạ sang CommentDTO
        return mapToCommentDTO(savedComment);
    }

    private CommentDTO mapToCommentDTO(Comment comment) {
        CommentDTO commentDTO = new CommentDTO();
        commentDTO.setId(comment.getId());
        commentDTO.setContent(comment.getContent());
        commentDTO.setUserId(comment.getUserId());

        try {
            UserResponse user = userServiceClient.getUserById(comment.getUserId());
            commentDTO.setUserName(user.getFullName());
        } catch (Exception e) {
            commentDTO.setUserName("Unknown User");
        }

        return commentDTO;
    }
}
