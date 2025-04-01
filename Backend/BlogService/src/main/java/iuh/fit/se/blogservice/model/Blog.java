package iuh.fit.se.blogservice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Data
@Table(name = "blogs")
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;
    private String thumbnail;

    @ElementCollection
    @CollectionTable(name = "blog_images", joinColumns = @JoinColumn(name = "blog_id"))
    private List<String> images;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long authorId;

    @OneToMany(mappedBy = "blog" , cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Comment> comments;

    @OneToMany(mappedBy = "blog" , cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Like> likes;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;




}
