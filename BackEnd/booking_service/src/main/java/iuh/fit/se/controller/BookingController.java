package iuh.fit.se.controller;
import iuh.fit.se.dto.BookingResponseDTO;
import iuh.fit.se.entity.Booking;
import iuh.fit.se.entity.BookingStatus;
import iuh.fit.se.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(@RequestBody Booking bookingRequest) {
        // Đảm bảo participants có tham chiếu tới booking
        if (bookingRequest.getParticipants() != null) {
            bookingRequest.getParticipants().forEach(p -> p.setBooking(bookingRequest));
        }

        BookingResponseDTO response = bookingService.createBooking(bookingRequest);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable Long id) {
        Booking booking = bookingService.getBooking(id);
        return ResponseEntity.ok(booking);
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status) {
        Booking updatedBooking = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok(updatedBooking);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        bookingService.cancelBooking(id, reason != null ? reason : "No reason provided");
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Booking>> getBookingsByStatus(
            @PathVariable BookingStatus status) {
        List<Booking> bookings = bookingService.getAllBookings()
                .stream()
                .filter(b -> b.getBookingStatus() == status)
                .toList();
        return ResponseEntity.ok(bookings);
    }
}