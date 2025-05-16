package iuh.fit.se.blogservice.dto;

import lombok.Data;

@Data
public class LikeDTO {
    private Long id;
    private Long userId;
    private String userName;
}
