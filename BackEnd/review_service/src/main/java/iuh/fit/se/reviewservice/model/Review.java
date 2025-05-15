package iuh.fit.se.reviewservice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Getter
@Setter
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long tourId;
    private Long userId;
    private Integer rating;
    private String comment;

    @ElementCollection
    @CollectionTable(name = "review_images", joinColumns = @JoinColumn(name = "review_id"))
    @Column(name = "image_url")
    private List<String> images; // Danh sách ảnh review

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

//    @Enumerated(EnumType.STRING)
//    private ReviewStatus status;
}
