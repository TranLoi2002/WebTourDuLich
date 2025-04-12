package iuh.fit.booking_service.entity;

public enum BookingErrorCode {
    BOOKING_001("Tour ID và User ID là bắt buộc"),
    BOOKING_002("Bạn đã đặt tour này rồi"),
    BOOKING_003("Booking không tồn tại"),
    BOOKING_004("Không tìm thấy tour"),
    BOOKING_005("Tour không đủ chỗ trống"),
    BOOKING_006("Tour hiện tại không thể đặt"),
    BOOKING_007("Tour đã khởi hành hoặc phải đặt trước ít nhất 3 ngày"),
    BOOKING_008("Phải có ít nhất 1 người tham gia"),
    BOOKING_009("Thông tin người tham gia không đầy đủ");

    private final String message;

    BookingErrorCode(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public static String getMessageByCode(String code) {
        for (BookingErrorCode err : values()) {
            if (err.name().equals(code)) {
                return err.getMessage();
            }
        }
        return "Lỗi không xác định";
    }
}
