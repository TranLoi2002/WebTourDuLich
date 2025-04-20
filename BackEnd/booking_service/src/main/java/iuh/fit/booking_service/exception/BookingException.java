package iuh.fit.booking_service.exception;

import org.springframework.http.HttpStatus;

public class BookingException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final String errorCode;
    private final String errorMessage;

    public BookingException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.httpStatus = status;
        this.errorCode = errorCode;
        this.errorMessage = message; // Tạm thời dùng message, cần BookingErrorCode
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getErrorMessage() {
        return errorMessage;
    }
}