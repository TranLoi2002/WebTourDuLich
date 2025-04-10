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

    @Lob
    @Column(name = "content", columnDefinition = "LONGTEXT")
    private String content;
    private String thumbnail;

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
