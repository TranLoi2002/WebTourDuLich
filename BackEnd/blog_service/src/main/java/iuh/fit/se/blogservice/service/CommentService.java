package iuh.fit.se.blogservice.service;


import iuh.fit.se.blogservice.dto.CommentDTO;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommentService {
    CommentDTO createComment(Long blogId, CommentDTO commentDTO);
    List<CommentDTO> getCommentsByBlogId(Long blogId);
}
