package iuh.fit.se.catalogservice.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Data
@Getter
@Setter
@Table(name = "tours")
public class Tour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String duration;
    private Date startDate;
    private Date endDate;
    private Integer maxParticipants;
    private Integer currentParticipants;
    private String thumbnail;

    @ElementCollection(fetch = FetchType.EAGER) // Đảm bảo lấy dữ liệu luôn
    @CollectionTable(name = "tour_images", joinColumns = @JoinColumn(name = "tour_id")) // Bảng chứa danh sách ảnh
    @Column(name = "image_url") // Chỉ định tên cột cho ảnh
    private List<String> images;

    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;
}
