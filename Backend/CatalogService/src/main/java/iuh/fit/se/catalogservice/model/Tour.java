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

    // định danh riêng cho tour - dùng để tra cứu (có thể trùng)
    private String tourCode;
    private String title;
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "tour_highlights", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "highlight")
    private List<String> hightlight;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "tour_notes", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "note")
    private List<String> notes;

    private Double price;
    private int discount;

    private String placeOfDeparture;
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

    @ManyToOne
    @JoinColumn(name = "tour_type_id", nullable = false)
    private TourType tourType;
}
