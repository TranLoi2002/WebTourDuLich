package iuh.fit.se.nhom2_webtourdulich_booking_service.repository;

import iuh.fit.se.nhom2_webtourdulich_booking_service.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
}