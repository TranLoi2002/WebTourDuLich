package iuh.fit.booking_service.controller;

import iuh.fit.booking_service.dto.BookingResponseDTO;
import iuh.fit.booking_service.entity.Booking;
import iuh.fit.booking_service.entity.BookingStatus;
import iuh.fit.booking_service.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/booking")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<Page<BookingResponseDTO>> getAllBookings(Pageable pageable) {
        return ResponseEntity.ok(bookingService.getAllBookings(pageable));
    }

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(@RequestBody Booking bookingRequest) {
        return ResponseEntity.ok(bookingService.createBooking(bookingRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBooking(id));
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
        return ResponseEntity.ok(bookingService.cancelBooking(id, request.getReason(), Booking.CanceledBy.ADMIN));
    }

    @PostMapping("/{id}/user-cancel")
    public ResponseEntity<BookingResponseDTO> userCancelBooking(
            @PathVariable Long id,
            @RequestBody CancelRequest request,
            @RequestParam Long userId) {
        return ResponseEntity.ok(bookingService.userCancelBooking(id, request.getReason(), userId));
    }

    @GetMapping("/refund-statistics")
    public ResponseEntity<Map<String, Object>> getRefundStatistics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(bookingService.getRefundStatistics(start, end));
    }

    public static class CancelRequest {
        private String reason;

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }
}