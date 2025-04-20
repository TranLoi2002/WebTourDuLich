package iuh.fit.se.catalogservice.repository;

import iuh.fit.se.catalogservice.model.FavouriteTour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavouriteTourRepository extends JpaRepository<FavouriteTour, Long> {
    @Query("SELECT ft FROM FavouriteTour ft WHERE ft.userId = :userId")
    List<FavouriteTour> findByUserId(@Param("userId") Long userId);

    @Query("SELECT ft FROM FavouriteTour ft WHERE ft.userId = :userId AND ft.tour.id = :tourId")
    FavouriteTour findByUserIdAndTourId(@Param("userId") Long userId, @Param("tourId") Long tourId);

    @Query("SELECT COUNT(ft) > 0 FROM FavouriteTour ft WHERE ft.userId = :userId AND ft.tour.id = :tourId")
    boolean existsByUserIdAndTourId(@Param("userId") Long userId, @Param("tourId") Long tourId);
}
