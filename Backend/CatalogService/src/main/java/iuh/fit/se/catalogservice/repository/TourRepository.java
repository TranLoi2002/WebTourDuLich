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
}
