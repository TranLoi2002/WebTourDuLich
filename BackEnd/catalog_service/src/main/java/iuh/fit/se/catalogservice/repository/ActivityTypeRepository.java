package iuh.fit.se.catalogservice.repository;

import iuh.fit.se.catalogservice.model.ActivityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityTypeRepository extends JpaRepository<ActivityType, Long> {
    List<ActivityType> findByIsActive(boolean isActive);
}
