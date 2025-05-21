package iuh.fit.booking_service.entity;

public enum BookingErrorCode {
    MISSING_IDS("BOOKING_001", "Tour ID and User ID are required"),
    DUPLICATE_BOOKING("BOOKING_002", "You already have a booking for this tour"),
    NOT_FOUND("BOOKING_003", "Booking does not exist"),
    USER_NOT_FOUND("BOOKING_004", "User does not exist"),
    INSUFFICIENT_SEATS("BOOKING_005", "Tour has insufficient seats"),
    TOUR_INACTIVE("BOOKING_006", "Tour is currently not available for booking"),
    TOUR_STARTED("BOOKING_007", "Tour has already started"),
    BOOKING_TOO_LATE("BOOKING_008", "Booking must be made at least 3 days in advance"),
    NO_PARTICIPANTS("BOOKING_009", "At least one participant is required"),
    TOUR_NOT_FOUND("BOOKING_010", "Tour does not exist"),
    INVALID_MAX_PARTICIPANTS("BOOKING_011", "Maximum number of participants is invalid"),
    INVALID_PARTICIPANT("BOOKING_012", "Participant information is incomplete"),
    MISSING_BOOKING_ID("BOOKING_013", "Booking ID is required"),
    INVALID_TOUR_ID("BOOKING_014", "Tour ID cannot be null"),
    INVALID_PRICE("BOOKING_015", "Tour price is invalid"),
    MISSING_PAGEABLE("BOOKING_016", "Pageable is required"),
    MISSING_STATUS("BOOKING_017", "Booking ID and new status are required"),
    MISSING_CANCEL_PARAMS("BOOKING_018", "Booking ID and canceledBy are required"),
    MISSING_USER_CANCEL_PARAMS("BOOKING_019", "Booking ID and user ID are required"),
    MISSING_TOUR_USER_IDS("BOOKING_020", "Tour ID and user ID are required"),
    MISSING_USER_ID("BOOKING_021", "User ID is required"),
    MISSING_BOOKING_STATUS("BOOKING_022", "Booking status is required"),
    NULL_BOOKING_REQUEST("BOOKING_023", "Booking request cannot be null"),
    SERVICE_UNAVAILABLE_TOUR("BOOKING_024", "Failed to fetch tour from catalog service"),
    SERVICE_UNAVAILABLE_USER("BOOKING_025", "Failed to fetch user from user service"),
    MISSING_GENDER("BOOKING_026", "Gender is required"),
    MISSING_AGE_TYPE("BOOKING_027", "Age type is required"),
    MISSING_STATUS_PARAMS("BOOKING_028", "Current and new status are required"),
    MISSING_TOUR_START_DATE("BOOKING_029", "Tour start date is required"),
    COMPLETED_STATUS_TRANSITION("BOOKING_030", "Cannot transition status from COMPLETED"),
    INVALID_PENDING_TO_COMPLETED("BOOKING_031", "Cannot transition status from PENDING to COMPLETED"),
    CANCELLED_STATUS_TRANSITION("BOOKING_032", "Cannot transition status when CANCELLED"),
    INVALID_PARTICIPANT_COUNT("BOOKING_033", "Invalid participant count after cancellation"),
    UPDATE_PARTICIPANTS_FAILED("BOOKING_034", "The tour is not full for your number of participants."),
    MISSING_CANCEL_REASON("BOOKING_036", "Reason is required when cancelling a confirmed booking"),
    COMPLETED_BOOKING_CANCEL("BOOKING_038", "Cannot cancel a completed booking"),
    UNAUTHORIZED_CANCEL("BOOKING_039", "You are not authorized to cancel this booking"),
    ALREADY_CANCELLED("BOOKING_040", "Booking is already cancelled"),
    DUPLICATE_PARTICIPANT("BOOKING_041", "Duplicate participant"),
    INVALID_BOOKING_CODE_GENERATION("BOOKING_042", "User and tour information are required for booking code generation"),
    INVALID_PARTICIPANT_NAME_LENGTH("BOOKING_043", "Participant name must be at least 2 characters long"),
    INVALID_PARTICIPANT_NAME_FORMAT("BOOKING_044", "Participant name can only contain letters and spaces"),
    INTERNAL_ERROR("BOOKING_050", "Unable to process request due to system error");

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
        return "Unknown error";
    }
}
