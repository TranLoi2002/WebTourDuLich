package iuh.fit.booking_service.repository;

import iuh.fit.booking_service.entity.Booking;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    @EntityGraph(attributePaths = {"participants"})
    Optional<Booking> findById(Long id);

    @EntityGraph(attributePaths = {"participants"})
    Booking findBookingByTourIdAndUserId(Long tourId, Long userId);

    List<Booking> findBookingByUserId(Long userId);

    Optional<Booking> findBookingByBookingDate(LocalDateTime bookingDate, Sort sort);
}