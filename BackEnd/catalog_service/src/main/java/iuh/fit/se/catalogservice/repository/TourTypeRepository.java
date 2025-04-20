package iuh.fit.se.catalogservice.repository;

import iuh.fit.se.catalogservice.model.Tour;
import iuh.fit.se.catalogservice.model.TourType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourTypeRepository extends JpaRepository<TourType, Long> {
    List<TourType> findByIsActive(boolean isActive);
}
