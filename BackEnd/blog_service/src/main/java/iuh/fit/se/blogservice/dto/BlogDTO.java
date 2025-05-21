package iuh.fit.se.blogservice.dto;

import lombok.Data;

import java.util.List;

@Data
public class BlogDTO {
    private Long id;
    private String title;
    private String content;
    private String thumbnail;
    private String external_url;
    private Long authorId;
    private String authorName;
    private String authorAvatar;
    private Long categoryId;
    private String categoryName;
    private String status;
    private boolean isActive;
    private Long commentCount;
    private List<CommentDTO> comments;
    private Long likeCount;
    private List<LikeDTO> likes;

    private String createdAt;
    private String updatedAt;

}
