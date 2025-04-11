package iuh.fit.booking_service.exception;

import org.springframework.http.HttpStatus;

public class BookingException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final String errorCode;

    public BookingException(String message, HttpStatus httpStatus, String errorCode) {
        super(message);
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
    }
    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getErrorCode() {
        return errorCode;
    }
}