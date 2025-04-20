package iuh.fit.booking_service.entity;

public enum BookingErrorCode {
    MISSING_IDS("BOOKING_001", "Tour ID và User ID là bắt buộc"),
    DUPLICATE_BOOKING("BOOKING_002", "Bạn đã có booking cho tour này rồi"),
    NOT_FOUND("BOOKING_003", "Booking không tồn tại"),
    USER_NOT_FOUND("BOOKING_004", "User không tồn tại"),
    TOUR_NOT_FOUND("BOOKING_010", "Tour không tồn tại"),
    INSUFFICIENT_SEATS("BOOKING_005", "Tour không đủ chỗ"),
    TOUR_INACTIVE("BOOKING_006", "Tour hiện tại không cho phép đặt"),
    TOUR_STARTED("BOOKING_007", "Tour đã khởi hành"),
    BOOKING_TOO_LATE("BOOKING_008", "Phải đặt tour ít nhất 3 ngày trước"),
    NO_PARTICIPANTS("BOOKING_009", "Phải có ít nhất 1 người tham gia"),
    INVALID_PARTICIPANT("BOOKING_012", "Thông tin người tham gia không đầy đủ"),
    INVALID_MAX_PARTICIPANTS("BOOKING_011", "Số lượng người tham gia tối đa không hợp lệ");

    private final String code;
    private final String message;

    BookingErrorCode(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public static String getMessageByCode(String code) {
        for (BookingErrorCode error : values()) {
            if (error.getCode().equals(code)) {
                return error.getMessage();
            }
        }
        return "Lỗi không xác định";
    }
}