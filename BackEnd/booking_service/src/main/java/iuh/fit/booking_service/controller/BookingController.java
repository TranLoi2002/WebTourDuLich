package iuh.fit.booking_service.controller;

import iuh.fit.booking_service.dto.BookingResponseDTO;
import iuh.fit.booking_service.entity.Booking;
import iuh.fit.booking_service.entity.BookingStatus;
import iuh.fit.booking_service.entity.CancelReason;
import iuh.fit.booking_service.entity.CanceledBy;
import iuh.fit.booking_service.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/booking")
@RequiredArgsConstructor
public class BookingController {
    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);
    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<Page<BookingResponseDTO>> getAllBookings(Pageable pageable) {
        return ResponseEntity.ok(bookingService.getAllBookings(pageable));
    }

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(@RequestBody Booking bookingRequest) {
        logger.info("Received request to create booking: {}", bookingRequest);
        return ResponseEntity.ok(bookingService.createBooking(bookingRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBooking(id));
    }
    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(@RequestParam Long userId) {
        logger.info("Fetching bookings for user: {}", userId);
        return ResponseEntity.ok(bookingService.getAllBookingByUser(userId));
    }


    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingResponseDTO> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable Long id,
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
    }
}