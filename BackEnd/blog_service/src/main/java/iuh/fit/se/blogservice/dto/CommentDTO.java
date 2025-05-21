package iuh.fit.se.blogservice.dto;

import iuh.fit.se.blogservice.model.Comment;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class CommentDTO {
    private Long id;
    private String content;
    private Long userId;
    private String userName;
    private Long parentId;
    private List<CommentDTO> replies;
    private String userAvatar;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CommentDTO() {
    }

    public CommentDTO(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.userId = comment.getUserId();
//        this.userName = comment.getUserName();
//        this.userAvatar = comment.getUserAvatar();
        this.parentId = comment.getParent() != null ? comment.getParent().getId() : null;
        this.createdAt = comment.getCreatedAt();
        this.updatedAt = comment.getUpdatedAt();
        this.replies = new ArrayList<>();
    }
}
