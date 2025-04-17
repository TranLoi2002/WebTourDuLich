package iuh.fit.booking_service.repository;

import iuh.fit.booking_service.entity.Booking;
import iuh.fit.booking_service.entity.BookingStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for managing Booking entities.
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @EntityGraph(attributePaths = {"participants"})
    Optional<Booking> findById(Long id);

    @EntityGraph(attributePaths = {"participants"})
    Booking findBookingByTourIdAndUserId(Long tourId, Long userId);

    List<Booking> findBookingByUserId(Long userId);
    boolean existsByBookingCode(String bookingCode);
    @Query("SELECT COALESCE(COUNT(p), 0) FROM Booking b JOIN b.participants p " +
            "WHERE b.tourId = :tourId AND b.bookingStatus != 'CANCELLED'")
    int countTotalParticipantsByTourId(@Param("tourId") Long tourId);

    Optional<Booking> findBookingByBookingDate(LocalDateTime bookingDate);
    List<Booking> findBookingByBookingStatus(BookingStatus bookingStatus);
    List<Booking> findByBookingStatusAndPaymentDueTimeBefore(BookingStatus bookingStatus, LocalDateTime now);
}