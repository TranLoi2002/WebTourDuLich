package iuh.fit.se.repository;

import iuh.fit.se.entity.Booking;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    @EntityGraph(attributePaths = {"participants"})
    Optional<Booking> findById(Long id);

    @EntityGraph(attributePaths = {"participants"})
    Booking findBookingByTourIdAndUserId(Long tourId, Long userId);
}