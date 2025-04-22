package iuh.fit.booking_service.service;

import iuh.fit.booking_service.dto.BookingResponseDTO;
import iuh.fit.booking_service.entity.Booking;
import iuh.fit.booking_service.entity.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface BookingService {
    BookingResponseDTO createBooking(Booking bookingRequest);
    Booking getBooking(Long id);
    Page<BookingResponseDTO> getAllBookings(Pageable pageable);
    BookingResponseDTO updateBookingStatus(Long id, BookingStatus newStatus);
    BookingResponseDTO cancelBooking(Long id, String reason, Booking.CanceledBy canceledBy);
    BookingResponseDTO userCancelBooking(Long id, String reason, Long userId);
    boolean canUserBookTour(Long tourId, Long userId);
    List<Booking> getAllBookingByUser(Long userId);
    List<Booking> getBookingsByStatus(BookingStatus status);
    Map<String, Object> getRefundStatistics(LocalDateTime start, LocalDateTime end);
}