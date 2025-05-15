package iuh.fit.se.reviewservice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Data
@Table(name = "review_replies")
public class ReviewReply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long reviewId;
    private Long userId;
    private String content;

//    @Enumerated(EnumType.STRING)
//    private ReviewStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
