package iuh.fit.se.service;

import iuh.fit.se.dto.BookingDTO;
import iuh.fit.se.entity.Booking;
import iuh.fit.se.entity.BookingStatus;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public interface BookingService {
    Booking createBooking(BookingDTO request);
    Booking getBooking(Long id);
    List<Booking> getAllBookings();
    Booking updateBookingStatus(Long id, BookingStatus status);
    void cancelBooking(Long id, String reason);

}