package iuh.fit.se.catalogservice.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "tour_images", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "image_url")
    private List<String> images;

    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    @JsonManagedReference
    private Location location;

    @ManyToOne
    @JoinColumn(name = "tour_type_id", nullable = false)
    @JsonManagedReference
    private TourType tourType;
}