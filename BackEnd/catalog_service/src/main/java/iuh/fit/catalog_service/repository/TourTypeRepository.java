package iuh.fit.catalog_service.repository;

import iuh.fit.catalog_service.model.Tour;
import iuh.fit.catalog_service.model.TourType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourTypeRepository extends JpaRepository<TourType, Long> {
}
