package iuh.fit.se.blogservice.dto;

import lombok.Data;

@Data
public class CommentDTO {
    private Long id;
    private String content;
    private Long userId;
    private String userName;

}
