package iuh.fit.booking_service.controller;

import iuh.fit.booking_service.dto.BookingResponseDTO;
import iuh.fit.booking_service.entity.Booking;
import iuh.fit.booking_service.entity.BookingStatus;
import iuh.fit.booking_service.entity.CancelReason;
import iuh.fit.booking_service.entity.CanceledBy;
import iuh.fit.booking_service.service.BookingService;
import lombok.RequiredArgsConstructor;
<<<<<<< HEAD
=======
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

<<<<<<< HEAD
=======
import java.util.Arrays;
import java.util.List;
import java.util.Map;

>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
@RestController
@RequestMapping("/booking")
@RequiredArgsConstructor
public class BookingController {
<<<<<<< HEAD

=======
    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<Page<BookingResponseDTO>> getAllBookings(Pageable pageable) {
        return ResponseEntity.ok(bookingService.getAllBookings(pageable));
    }

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(@RequestBody Booking bookingRequest) {
<<<<<<< HEAD
=======
        logger.info("Received request to create booking: {}", bookingRequest);
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
        return ResponseEntity.ok(bookingService.createBooking(bookingRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBooking(id));
    }
<<<<<<< HEAD
=======
    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(@RequestParam Long userId) {
        logger.info("Fetching bookings for user: {}", userId);
        return ResponseEntity.ok(bookingService.getAllBookingByUser(userId));
    }

>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f

    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingResponseDTO> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable Long id,
<<<<<<< HEAD
            @RequestParam String reason) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, reason));
=======
            @RequestBody CancelRequest request) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, request.getReason(), CanceledBy.ADMIN));
    }

    @PostMapping("/{id}/user-cancel")
    public ResponseEntity<BookingResponseDTO> userCancelBooking(
            @PathVariable Long id,
            @RequestBody CancelRequest request,
            @RequestParam Long userId) {
        logger.info("Received request to cancel booking ID: {} by user ID: {} with reason: {}",
                id, userId, request.getReason());
        return ResponseEntity.ok(bookingService.userCancelBooking(id, request.getReason(), userId));
    }

    @GetMapping("/cancel-reasons")
    public ResponseEntity<List<Map<String, String>>> getCancelReasons() {
        List<Map<String, String>> reasons = Arrays.stream(CancelReason.values())
                .map(reason -> Map.of(
                        "value", reason.name(),
                        "description", reason.getDescription()
                ))
                .toList();
        return ResponseEntity.ok(reasons);
    }

    public static class CancelRequest {
        private CancelReason reason;

        public CancelReason getReason() {
            return reason;
        }

        public void setReason(CancelReason reason) {
            this.reason = reason;
        }
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
    }
}