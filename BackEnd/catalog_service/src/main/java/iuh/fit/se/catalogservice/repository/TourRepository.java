package iuh.fit.se.catalogservice.repository;

import iuh.fit.se.catalogservice.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long>{
    @Query("SELECT t FROM Tour t WHERE t.tourType.id = :tourTypeId")
    List<Tour> findByTourTypeId(@Param("tourTypeId") Long tourTypeId);

    @Query(value = "SELECT t.* " +
            "FROM tours t " +
            "JOIN tour_activity ta ON t.id = ta.tour_id " +
            "JOIN activity_types at ON ta.activity_type_id = at.id " +
            "WHERE t.is_activity_tour = true " +
            "AND at.name = :activityTypeName",
            nativeQuery = true)
    List<Tour> findToursByActivityType(@Param("activityTypeName") String activityTypeName);

    // get tour by location id
    @Query("SELECT t FROM Tour t WHERE t.location.id = :locationId")
    List<Tour> getToursByLocationId(@Param("locationId") Long locationId);

    List<Tour> findByIsActive(boolean isActive);
}
