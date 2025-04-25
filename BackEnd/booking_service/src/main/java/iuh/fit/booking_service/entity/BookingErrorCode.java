package iuh.fit.booking_service.entity;

public enum BookingErrorCode {
    MISSING_IDS("BOOKING_001", "Tour ID và User ID là bắt buộc"),
    DUPLICATE_BOOKING("BOOKING_002", "Bạn đã có booking cho tour này rồi"),
    NOT_FOUND("BOOKING_003", "Booking không tồn tại"),
    USER_NOT_FOUND("BOOKING_004", "User không tồn tại"),
    INSUFFICIENT_SEATS("BOOKING_005", "Tour không đủ chỗ"),
    TOUR_INACTIVE("BOOKING_006", "Tour hiện tại không cho phép đặt"),
    TOUR_STARTED("BOOKING_007", "Tour đã khởi hành"),
    BOOKING_TOO_LATE("BOOKING_008", "Phải đặt tour ít nhất 3 ngày trước"),
    NO_PARTICIPANTS("BOOKING_009", "Phải có ít nhất 1 người tham gia"),
    TOUR_NOT_FOUND("BOOKING_010", "Tour không tồn tại"),
    INVALID_MAX_PARTICIPANTS("BOOKING_011", "Số lượng người tham gia tối đa không hợp lệ"),
    INVALID_PARTICIPANT("BOOKING_012", "Thông tin người tham gia không đầy đủ"),
    INVALID_TOUR_ID("BOOKING_014", "Tour ID không được null"),
    INVALID_PRICE("BOOKING_015", "Giá tour không hợp lệ"),
    INVALID_PARTICIPANT_NAME_LENGTH("BOOKING_017", "Tên người tham gia phải có ít nhất 2 ký tự"),
    INVALID_PARTICIPANT_NAME_FORMAT("BOOKING_018", "Tên người tham gia chỉ được chứa chữ cái và khoảng trắng"),
    DUPLICATE_PARTICIPANT("BOOKING_020", "Người tham gia trùng lặp"),
    MISSING_GENDER("BOOKING_026", "Giới tính không được để trống"),
    MISSING_AGE_TYPE("BOOKING_027", "Loại tuổi không được để trống"),
    COMPLETED_STATUS_TRANSITION("BOOKING_030", "Không thể chuyển trạng thái từ COMPLETED"),
    INVALID_PENDING_TO_COMPLETED("BOOKING_031", "Không thể chuyển trạng thái từ PENDING sang COMPLETED"),
    CANCELLED_STATUS_TRANSITION("BOOKING_032", "Không thể chuyển trạng thái khi đang là CANCELLED"),
    INVALID_PARTICIPANT_COUNT("BOOKING_033", "Số lượng người tham gia không hợp lệ sau khi hủy"),
    UPDATE_PARTICIPANTS_FAILED("BOOKING_034", "Không thể cập nhật số lượng người tham gia"),
    MISSING_CANCEL_REASON("BOOKING_036", "Phải cung cấp lý do khi hủy booking đã xác nhận"),
    COMPLETED_BOOKING_CANCEL("BOOKING_038", "Không thể hủy booking đã hoàn thành"),
    UNAUTHORIZED_CANCEL("BOOKING_039", "Bạn không có quyền hủy booking này"),
    INTERNAL_ERROR("BOOKING_050", "Không thể xử lý yêu cầu do lỗi hệ thống");

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