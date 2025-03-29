package iuh.fit.se.exception;

import iuh.fit.se.entity.BookingStatus;
import org.springframework.http.HttpStatus;


public class InvalidBookingStatusException extends BookingException {

    private final BookingStatus currentStatus;
    private final BookingStatus targetStatus;

    public InvalidBookingStatusException(BookingStatus currentStatus,
                                         BookingStatus targetStatus) {
        super(
                String.format("Invalid status transition from %s to %s",
                        currentStatus, targetStatus),
                HttpStatus.BAD_REQUEST,
                "INVALID_STATUS_TRANSITION"
        );
        this.currentStatus = currentStatus;
        this.targetStatus = targetStatus;
    }

}