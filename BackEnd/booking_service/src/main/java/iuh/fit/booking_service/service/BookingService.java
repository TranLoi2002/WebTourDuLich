package iuh.fit.booking_service.service;

import iuh.fit.booking_service.dto.BookingResponseDTO;
import iuh.fit.booking_service.entity.Booking;
import iuh.fit.booking_service.entity.BookingStatus;
<<<<<<< HEAD
=======
import iuh.fit.booking_service.entity.CancelReason;
import iuh.fit.booking_service.entity.CanceledBy;
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
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
<<<<<<< HEAD
    BookingResponseDTO cancelBooking(Long id, String reason);
    boolean canUserBookTour(Long tourId, Long userId);
    List<Booking> getAllBookingByUser(Long userId);
=======
    BookingResponseDTO cancelBooking(Long id, CancelReason reason, CanceledBy canceledBy); // Thay đổi từ String sang CancelReason
    BookingResponseDTO userCancelBooking(Long id, CancelReason reason, Long userId); //
    boolean canUserBookTour(Long tourId, Long userId);
    List<BookingResponseDTO> getAllBookingByUser(Long userId);
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
    List<Booking> getBookingsByStatus(BookingStatus status);

}