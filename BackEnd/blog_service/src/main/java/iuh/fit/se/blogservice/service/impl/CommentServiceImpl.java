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

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

        Comment parentComment = null;
        if (commentDTO.getParentId() != null) {
            parentComment = commentRepository.findById(commentDTO.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found with id: " + commentDTO.getParentId()));
        }

        Comment comment = new Comment();
        comment.setContent(commentDTO.getContent());
        comment.setBlog(blog);
        comment.setUserId(commentDTO.getUserId());
        comment.setParent(parentComment);

        // Save the main comment
        Comment savedComment = commentRepository.save(comment);

        // Recursively save replies if they exist
        if (commentDTO.getReplies() != null && !commentDTO.getReplies().isEmpty()) {
            for (CommentDTO replyDTO : commentDTO.getReplies()) {
                replyDTO.setParentId(savedComment.getId());
                createComment(blogId, replyDTO);
            }
        }

        return new CommentDTO(savedComment);
    }

    @Override
    public List<CommentDTO> getCommentsByBlogId(Long blogId) {
        List<Comment> comments = commentRepository.findByBlogIdAndParentIdIsNull(blogId);
        return comments.stream()
                .map(this::mapToDTOWithReplies)
                .collect(Collectors.toList());
    }

    private CommentDTO mapToDTOWithReplies(Comment comment) {
        CommentDTO dto = new CommentDTO(comment);
        dto.setReplies(Optional.ofNullable(comment.getReplies())
                .orElse(Collections.emptyList())
                .stream()
                .map(this::mapToDTOWithReplies)
                .collect(Collectors.toList()));
        return dto;
    }
}
