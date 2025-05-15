
package iuh.fit.booking_service.exception;
import iuh.fit.booking_service.entity.BookingErrorCode;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BookingException.class)
    public ResponseEntity<ErrorResponse> handleBookingException(BookingException ex) {
        logger.error("BookingException: {} [{}]", ex.getErrorMessage(), ex.getErrorCode());
        ErrorResponse response = new ErrorResponse(
                ex.getErrorCode(),
                ex.getErrorMessage(),
                System.currentTimeMillis()
        );
        return new ResponseEntity<>(response, ex.getHttpStatus());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        logger.error("Unexpected error: {}", ex.getMessage(), ex);
        ErrorResponse response = new ErrorResponse(
                BookingErrorCode.INTERNAL_ERROR.getCode(),
                BookingErrorCode.INTERNAL_ERROR.getMessage(),
                System.currentTimeMillis()
        );
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Data
    @AllArgsConstructor
    private static class ErrorResponse {
        private String errorCode;
        private String message;
        private long timestamp;
    }
}
