package iuh.fit.se.nhom2_webtourdulich_booking_service.controller;

import iuh.fit.se.nhom2_webtourdulich_booking_service.model.Booking;
import iuh.fit.se.nhom2_webtourdulich_booking_service.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking")
public class BookingsController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public List<Booking> getAllBooking() {
        return bookingService.getAllBooking();
    }

    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id);
    }

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @PutMapping("/{id}")
    public Booking updateBookings(@PathVariable Long id, @RequestBody Booking booking) {
        return bookingService.updateBooking(id, booking);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
    }
}
