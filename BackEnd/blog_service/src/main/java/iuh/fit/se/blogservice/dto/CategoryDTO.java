package iuh.fit.se.blogservice.dto;

import lombok.Data;

@Data
public class CategoryDTO {
    private Long id;
    private String name;
    private String description;
    private boolean isActive;
}
