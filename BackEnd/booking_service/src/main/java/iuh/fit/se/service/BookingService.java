package iuh.fit.se.service;
import iuh.fit.se.dto.BookingResponseDTO;
import iuh.fit.se.entity.Booking;
import iuh.fit.se.entity.BookingStatus;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public interface BookingService {
    BookingResponseDTO createBooking(Booking request);
    Booking getBooking(Long id);
    List<Booking> getAllBookings();
    Booking updateBookingStatus(Long id, BookingStatus status);
    void cancelBooking(Long id, String reason);
    boolean canUserBookingService(Long bookingId,Long userId);

}