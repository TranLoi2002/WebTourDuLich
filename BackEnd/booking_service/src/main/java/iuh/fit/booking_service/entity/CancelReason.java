package iuh.fit.booking_service.entity;

public enum CancelReason {
    PERSONAL_REASON("Lý do cá nhân"),
    SCHEDULE_CONFLICT("Xung đột lịch trình"),
    FINANCIAL_ISSUE("Vấn đề tài chính"),
    TOUR_QUALITY_CONCERN("Lo ngại về chất lượng tour"),
    WEATHER_CONDITION("Điều kiện thời tiết bất lợi"),
    OPERATIONAL_ISSUE("Vấn đề vận hành tour"),
    LEGAL_RESTRICTION("Hạn chế pháp lý hoặc quy định"),
    OTHER("Lý do khác");
    private final String description;
    CancelReason(String description) {
        this.description = description;
    }
    public String getDescription() {
        return description;
    }


}