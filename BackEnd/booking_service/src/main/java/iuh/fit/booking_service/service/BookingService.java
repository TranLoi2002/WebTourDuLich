package iuh.fit.booking_service.service;

import iuh.fit.booking_service.dto.BookingResponseDTO;
import iuh.fit.booking_service.entity.Booking;
import iuh.fit.booking_service.entity.BookingStatus;

import java.util.List;

public interface BookingService {
    BookingResponseDTO createBooking(Booking bookingRequest);
    Booking getBooking(Long id);
    List<Booking> getAllBookings();
    BookingResponseDTO updateBookingStatus(Long id, BookingStatus newStatus);
    BookingResponseDTO cancelBooking(Long id, String reason);
    boolean canUserBookingService(Long tourId, Long userId);
    List<Booking> getAllBookingByUser(Long userId);
    List<Booking> getBookingsByStatus(BookingStatus status);
}