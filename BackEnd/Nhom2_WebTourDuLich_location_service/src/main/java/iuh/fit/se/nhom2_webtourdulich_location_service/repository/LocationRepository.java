package iuh.fit.se.nhom2_webtourdulich_location_service.repository;

import iuh.fit.se.nhom2_webtourdulich_location_service.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
}
