package iuh.fit.se.nhom2_webtourdulich_service_service.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Services")
public class Services {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Service_ID")
    private Long id;

    @Column(name = "Services_Name", nullable = false)
    private String name;

    @Column(name = "Price", nullable = false)
    private BigDecimal price;

    @Column(name = "Description")
    private String description;

    @Column(name = "Is_Active", nullable = false)
    private Boolean isActive;

    @Column(name = "Create_At", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "Update_At")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Services() {
    }

    public Services(LocalDateTime updatedAt, LocalDateTime createdAt, Boolean isActive, String description, BigDecimal price, String name, Long id) {
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
        this.isActive = isActive;
        this.description = description;
        this.price = price;
        this.name = name;
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
