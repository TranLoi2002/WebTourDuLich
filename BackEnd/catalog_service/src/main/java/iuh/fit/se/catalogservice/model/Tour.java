package iuh.fit.se.catalogservice.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;
import java.util.Set;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Data
@Getter
@Setter
@Table(name = "tours")
public class Tour extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @JsonIgnore
    private String tourCode;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must be less than 255 characters")
    private String title;

    @Lob
    @Column(name = "description", columnDefinition = "LONGTEXT")
    private String description;

    @Lob
    @Column(name = "highlights", columnDefinition = "LONGTEXT")
    private String highlights;

    private boolean isActivityTour = false;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive number")
    private Double price;

    @Min(value = 0, message = "Discount must be at least 0")
    @Max(value = 100, message = "Discount must be at most 100")
    private int discount;

    @NotBlank(message = "Place of departure is required")
    private String placeOfDeparture;

//    @JsonIgnore
//    @NotBlank(message = "Duration is required")
    private String duration;

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date must be in the future or present")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "UTC")
    private Date startDate;

    @NotNull(message = "End date is required")
    @Future(message = "End date must be in the future")
    @Temporal(TemporalType.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "UTC")
    private Date endDate;

    @NotNull(message = "Max participants is required")
    @Min(value = 1, message = "Max participants must be at least 1")
    @Positive(message = "Max participants must be positive number")
    private Integer maxParticipants;

    @NotNull(message = "Current participants is required")
    @Min(value = 0, message = "Current participants must be at least 0")
//    @Positive(message = "Current participants must be positive number")
    private Integer currentParticipants;

    @NotNull(message = "Rating is required")
    @Pattern(regexp = "^(http|https)://.*$", message = "Thumbnail must be a valid URL.")
    private String thumbnail;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "tour_images", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "image_url")
    private List<@Pattern(regexp = "^(http|https)://.*$", message = "Each image must be a valid URL.") String> images;

    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    @JsonManagedReference
    private Location location;

    @ManyToOne
    @JoinColumn(name = "tour_type_id", nullable = false)
    @JsonManagedReference
    private TourType tourType;

    @ManyToMany
    @JoinTable(
            name = "tour_activity",
            joinColumns = @JoinColumn(name = "tour_id"),
            inverseJoinColumns = @JoinColumn(name = "activity_type_id")
    )
    @JsonIgnore
    private Set<ActivityType> activityTypes;

    @Enumerated(EnumType.STRING)
    private TourStatus status;

    @Transient
    private Double averageRating;

    @Transient
    private Long totalReviews;
}