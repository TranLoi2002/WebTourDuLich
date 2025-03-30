package iuh.fit.se.repository;

import iuh.fit.se.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;


@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Booking findBookingByTourIdAndUserId(Long tourId, Long userId);


}