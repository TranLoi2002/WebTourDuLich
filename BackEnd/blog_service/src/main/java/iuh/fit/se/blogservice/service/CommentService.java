package iuh.fit.se.blogservice.service;


import iuh.fit.se.blogservice.dto.CommentDTO;

public interface CommentService {
    CommentDTO createComment(Long blogId, CommentDTO commentDTO);
}
