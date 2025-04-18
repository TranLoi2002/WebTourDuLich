package iuh.fit.se.catalogservice.repository;

import iuh.fit.se.catalogservice.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long>{
    List<Location> findByIsActive(boolean isActive);
}
