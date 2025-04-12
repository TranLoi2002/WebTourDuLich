package iuh.fit.booking_service.service;
import iuh.fit.booking_service.dto.BookingResponseDTO;
import iuh.fit.booking_service.entity.Booking;
import iuh.fit.booking_service.entity.BookingStatus;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public interface BookingService {
    BookingResponseDTO createBooking(Booking request);
    Booking getBooking(Long id);
    List<Booking> getAllBookings();
    BookingResponseDTO updateBookingStatus(Long id, BookingStatus status);
    BookingResponseDTO cancelBooking(Long id, String reason);
    boolean canUserBookingService(Long bookingId,Long userId);
    List<Booking> getAllBookingByUser(Long userId);

}