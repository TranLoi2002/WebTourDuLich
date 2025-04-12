package iuh.fit.booking_service.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BookingException.class)
    public ResponseEntity<ErrorResponse> handleBookingException(BookingException ex) {
        ErrorResponse response = new ErrorResponse(
                ex.getErrorCode(),
                ex.getMessage(),
                ex.getErrorMessage(),
                System.currentTimeMillis()
        );
        return new ResponseEntity<>(response, ex.getHttpStatus());
    }

    @Data
    @AllArgsConstructor
    private static class ErrorResponse {
        private String errorCode;
        private String message;
        private String errorMessage;
        private long timestamp;
    }
}
