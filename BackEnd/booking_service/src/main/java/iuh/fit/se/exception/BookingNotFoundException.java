package iuh.fit.se.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


@ResponseStatus(HttpStatus.NOT_FOUND)
public class BookingNotFoundException extends RuntimeException {
    private final String errorCode;
    private final Long bookingId;
    public BookingNotFoundException(Long bookingId) {
        super(String.format("Booking with ID %d not found", bookingId));
        this.errorCode = "BOOKING_NOT_FOUND";
        this.bookingId = bookingId;
    }


}