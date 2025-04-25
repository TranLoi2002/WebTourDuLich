package iuh.fit.booking_service.service.impl;

import iuh.fit.booking_service.client.catalog.CatalogClient;
import iuh.fit.booking_service.client.user.UserClient;
import iuh.fit.booking_service.dto.BookingResponseDTO;
import iuh.fit.booking_service.dto.LightTourDTO;
import iuh.fit.booking_service.dto.TourDTO;
import iuh.fit.booking_service.dto.UserDTO;
import iuh.fit.booking_service.entity.*;
import iuh.fit.booking_service.exception.BookingException;
import iuh.fit.booking_service.exception.InvalidBookingStatusException;
import iuh.fit.booking_service.repository.BookingRepository;
import iuh.fit.booking_service.service.BookingService;
import iuh.fit.booking_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private static final Logger logger = LoggerFactory.getLogger(BookingServiceImpl.class);
    private static final String TIMEZONE = "Asia/Ho_Chi_Minh";
    private static final String BOOKING_TOPIC = "/topic/bookings";
    private static final String UPDATE_TOPIC = "/topic/booking-updates";
    private static final long THREE_DAYS_IN_MILLIS = 3 * 24 * 60 * 60 * 1000L;
    private static final double FULL_REFUND_RATE = 1.0;
    private static final double HALF_REFUND_RATE = 0.5;
    private static final int PAYMENT_DUE_HOURS = 48;

    private final BookingRepository bookingRepository;
    private final EmailService emailService;
    private final CatalogClient catalogClient;
    private final UserClient userClient;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public BookingResponseDTO createBooking(Booking bookingRequest) {
        logger.info("Creating booking for tourId: {}, userId: {}", bookingRequest.getTourId(), bookingRequest.getUserId());
        validateBookingRequest(bookingRequest);

        LightTourDTO tour = fetchTour(bookingRequest.getTourId());
        UserDTO user = fetchUser(bookingRequest.getUserId());
        validateTour(tour);

        // Kiểm tra booking hiện có
        Booking existingBooking = bookingRepository.findBookingByTourIdAndUserId(bookingRequest.getTourId(), bookingRequest.getUserId());
        if (existingBooking != null) {
            if (existingBooking.getBookingStatus() == BookingStatus.PENDING || existingBooking.getBookingStatus() == BookingStatus.CONFIRMED) {
                throw new BookingException(
                        "Bạn đã có booking đang hoạt động cho tour này",
                        HttpStatus.CONFLICT,
                        "BOOKING_041"
                );
            } else if (existingBooking.getBookingStatus() == BookingStatus.CANCELLED) {
                logger.info("Deleting cancelled booking with code: {}", existingBooking.getBookingCode());
                bookingRepository.delete(existingBooking);
            }
        }

        // Tạo booking mới
        validateParticipants(bookingRequest.getParticipants());
        Booking newBooking = prepareBooking(bookingRequest, user, tour);

        // Giữ nguyên bookingCode cũ nếu có
        if (existingBooking != null && existingBooking.getBookingStatus() == BookingStatus.CANCELLED) {
            newBooking.setBookingCode(existingBooking.getBookingCode());
        }

        int totalParticipants = bookingRepository.countTotalParticipantsByTourId(bookingRequest.getTourId());
        int remaining = tour.getMaxParticipants() - totalParticipants;
        if (newBooking.getParticipants().size() > remaining) {
            throw new BookingException(
                    BookingErrorCode.INSUFFICIENT_SEATS.getMessage() + ": " + remaining,
                    HttpStatus.CONFLICT,
                    BookingErrorCode.INSUFFICIENT_SEATS.getCode()
            );
        }

        Booking savedBooking = bookingRepository.save(newBooking);
        logger.info("Saved new booking with code: {}", savedBooking.getBookingCode());

        updateTourParticipants(tour, savedBooking.getParticipants().size(), true);
        logger.info("Updated tour participants for tour: {}", tour.getTourId());

        BookingResponseDTO response = convertToResponseDTO(savedBooking, tour, user);
        broadcastBookingEvent(BOOKING_TOPIC, response, savedBooking.getBookingCode());
        sendBookingConfirmationAsync(savedBooking, user, tour);

        logger.info("Booking created successfully with code: {}", savedBooking.getBookingCode());
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public Booking getBooking(Long id) {
        logger.info("Fetching booking with id: {}", id);
        return bookingRepository.findByIdWithParticipants(id)
                .orElseThrow(() -> new BookingException(
                        BookingErrorCode.NOT_FOUND.getMessage(),
                        HttpStatus.NOT_FOUND,
                        BookingErrorCode.NOT_FOUND.getCode()
                ));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponseDTO> getAllBookings(Pageable pageable) {
        logger.info("Fetching bookings with page: {}, size: {}", pageable.getPageNumber(), pageable.getPageSize());
        return bookingRepository.findAll(pageable)
                .map(booking -> convertToResponseDTO(
                        booking,
                        fetchTour(booking.getTourId()),
                        fetchUser(booking.getUserId())
                ));
    }

    @Override
    @Transactional
    public BookingResponseDTO updateBookingStatus(Long id, BookingStatus newStatus) {
        logger.info("Updating booking status for id: {} to {}", id, newStatus);
        Booking booking = getBooking(id);
        validateStatusTransition(booking.getBookingStatus(), newStatus);

        booking.setBookingStatus(newStatus);
        booking.setUpdatedAt(LocalDateTime.now());
        if (newStatus != BookingStatus.PENDING) {
            booking.setPaymentDueTime(null);
        }

        Booking updatedBooking = bookingRepository.save(booking);
        LightTourDTO tour = fetchTour(updatedBooking.getTourId());
        UserDTO user = fetchUser(updatedBooking.getUserId());
        BookingResponseDTO response = convertToResponseDTO(updatedBooking, tour, user);

        // Gửi email xác nhận thanh toán nếu trạng thái mới là CONFIRMED
        if (newStatus == BookingStatus.CONFIRMED) {
            logger.info("Booking status updated to CONFIRMED for booking {}. Sending payment confirmation email.", updatedBooking.getBookingCode());
            sendPaymentConfirmationAsync(updatedBooking, user, tour);
        }

        broadcastBookingEvent(UPDATE_TOPIC, response, updatedBooking.getBookingCode());
        return response;
    }

    @Override
    @Transactional
    public BookingResponseDTO cancelBooking(Long id, CancelReason reason, CanceledBy canceledBy) {
        logger.info("Cancelling booking with id: {}, reason: {}, canceledBy: {}", id, reason, canceledBy);
        Booking booking = getBooking(id);
        validateCancelRequest(booking, reason);

        LightTourDTO tour = fetchTour(booking.getTourId());
        UserDTO user = fetchUser(booking.getUserId());
        int participantsToRemove = booking.getParticipants().size();

        int newParticipants = calculateNewParticipantCount(tour, participantsToRemove);
        updateBookingForCancellation(booking, reason, canceledBy, tour);
        Booking cancelledBooking = bookingRepository.save(booking);

        updateTourParticipants(tour, newParticipants, false);
        BookingResponseDTO response = convertToResponseDTO(cancelledBooking, tour, user);
        broadcastBookingEvent(UPDATE_TOPIC, response, cancelledBooking.getBookingCode());

        return response;
    }

    @Override
    @Transactional
    public BookingResponseDTO userCancelBooking(Long id, CancelReason reason, Long userId) {
        logger.info("User {} cancelling booking with id: {}, reason: {}", userId, id, reason);
        Booking booking = getBooking(id);
        if (!booking.getUserId().equals(userId)) {
            throw new BookingException(
                    "Bạn không có quyền hủy booking này",
                    HttpStatus.FORBIDDEN,
                    "BOOKING_039"
            );
        }
        return cancelBooking(id, reason, CanceledBy.USER);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean canUserBookTour(Long tourId, Long userId) {
        logger.debug("Checking if user {} can book tour {}", userId, tourId);
        Booking existing = bookingRepository.findBookingByTourIdAndUserId(tourId, userId);
        return existing == null || (existing.getBookingStatus() == BookingStatus.CANCELLED);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> getAllBookingByUser(Long userId) {
        logger.info("Fetching bookings for user: {}", userId);
        return bookingRepository.findBookingByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> getBookingsByStatus(BookingStatus status) {
        logger.info("Fetching bookings with status: {}", status);
        return bookingRepository.findBookingByBookingStatus(status);
    }

    @Override
    public Map<String, Object> getRefundStatistics(LocalDateTime start, LocalDateTime end) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("pendingCount", bookingRepository.findByRefundStatus(RefundStatus.PENDING).size());
        stats.put("completedCount", bookingRepository.findByRefundStatus(RefundStatus.COMPLETED).size());
        stats.put("failedCount", bookingRepository.findByRefundStatus(RefundStatus.FAILED).size());

        Double completedAmount = bookingRepository.sumRefundAmountByRefundStatus(RefundStatus.COMPLETED);
        stats.put("completedAmount", completedAmount != null ? completedAmount : 0.0);

        Double periodAmount = bookingRepository.sumRefundAmountByRefundStatusAndUpdatedAtBetween(
                RefundStatus.COMPLETED, start, end
        );
        stats.put("periodCompletedAmount", periodAmount != null ? periodAmount : 0.0);

        return stats;
    }

    @Scheduled(cron = "0 * * * * *") // Chạy mỗi phút
    @Transactional
    public void completeStartedBookings() {
        logger.info("Checking for bookings to complete based on tour start date");
        List<Booking> confirmedBookings = bookingRepository.findBookingByBookingStatus(BookingStatus.CONFIRMED);
        Date now = new Date();

        for (Booking booking : confirmedBookings) {
            LightTourDTO tour = fetchTour(booking.getTourId());
            if (tour.getStartDate() != null && tour.getStartDate().getTime() + 1000 <= now.getTime()) { // 1 giây sau khi tour bắt đầu
                booking.setBookingStatus(BookingStatus.COMPLETED);
                booking.setUpdatedAt(LocalDateTime.now());
                booking.setPaymentDueTime(null);
                bookingRepository.save(booking);
                logger.info("Updated booking {} to COMPLETED for tour {}", booking.getBookingCode(), tour.getTourCode());

                UserDTO user = fetchUser(booking.getUserId());
                BookingResponseDTO response = convertToResponseDTO(booking, tour, user);
                broadcastBookingEvent(UPDATE_TOPIC, response, booking.getBookingCode());
            }
        }
    }

    @Scheduled(cron = "0 0 * * * *") // Chạy mỗi giờ
    @Transactional
    public void cancelOverdueBookings() {
        logger.info("Checking for overdue bookings to cancel");
        List<Booking> pendingBookings = bookingRepository.findBookingByBookingStatus(BookingStatus.PENDING);
        LocalDateTime now = LocalDateTime.now();

        for (Booking booking : pendingBookings) {
            if (booking.getPaymentDueTime() != null && now.isAfter(booking.getPaymentDueTime())) {
                LightTourDTO tour = fetchTour(booking.getTourId());
                UserDTO user = fetchUser(booking.getUserId());
                int participantsToRemove = booking.getParticipants().size();

                int newParticipants = calculateNewParticipantCount(tour, participantsToRemove);
                updateBookingForCancellation(booking, CancelReason.OTHER, CanceledBy.SYSTEM, tour);
                Booking cancelledBooking = bookingRepository.save(booking);

                updateTourParticipants(tour, newParticipants, false);
                BookingResponseDTO response = convertToResponseDTO(cancelledBooking, tour, user);
                broadcastBookingEvent(UPDATE_TOPIC, response, cancelledBooking.getBookingCode());
                logger.info("Automatically cancelled overdue booking {} due to payment timeout", booking.getBookingCode());
            }
        }
    }

    private void validateBookingRequest(Booking booking) {
        if (booking.getTourId() == null || booking.getUserId() == null) {
            throw new BookingException(
                    BookingErrorCode.MISSING_IDS.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.MISSING_IDS.getCode()
            );
        }
    }

    @Cacheable(value = "tours", key = "#tourId")
    public LightTourDTO fetchTour(Long tourId) {
        logger.info("Fetching tour with id: {}", tourId);
        LightTourDTO tour = catalogClient.getTourById(tourId);
        if (tour == null) {
            throw new BookingException(
                    BookingErrorCode.TOUR_NOT_FOUND.getMessage(),
                    HttpStatus.NOT_FOUND,
                    BookingErrorCode.TOUR_NOT_FOUND.getCode()
            );
        }
        return tour;
    }

    @Cacheable(value = "users", key = "#userId")
    public UserDTO fetchUser(Long userId) {
        logger.info("Fetching user with id: {}", userId);
        UserDTO user = userClient.getUserById(userId);
        if (user == null) {
            throw new BookingException(
                    BookingErrorCode.USER_NOT_FOUND.getMessage(),
                    HttpStatus.NOT_FOUND,
                    BookingErrorCode.USER_NOT_FOUND.getCode()
            );
        }
        return user;
    }

    private void validateBooking(LightTourDTO tour, UserDTO user, Booking booking) {
        validateTour(tour);
        validateParticipants(booking.getParticipants());
    }

    private void validateTour(LightTourDTO tour) {
        Date now = new Date();
        if (tour.getPrice() <= 0) {
            throw new BookingException(
                    BookingErrorCode.INVALID_MAX_PARTICIPANTS.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.INVALID_MAX_PARTICIPANTS.getCode()
            );
        }
        if (tour.getMaxParticipants() <= 0) {
            throw new BookingException(
                    BookingErrorCode.INVALID_MAX_PARTICIPANTS.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.INVALID_MAX_PARTICIPANTS.getCode()
            );
        }
        if (tour.getStartDate() != null && tour.getStartDate().before(now)) {
            throw new BookingException(
                    BookingErrorCode.TOUR_STARTED.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.TOUR_STARTED.getCode()
            );
        }
        if (tour.getStartDate() != null && tour.getStartDate().before(new Date(now.getTime() + THREE_DAYS_IN_MILLIS))) {
            throw new BookingException(
                    BookingErrorCode.BOOKING_TOO_LATE.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.BOOKING_TOO_LATE.getCode()
            );
        }
    }

    private void validateParticipants(List<Participant> participants) {
        if (participants == null || participants.isEmpty()) {
            throw new BookingException(
                    BookingErrorCode.NO_PARTICIPANTS.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.NO_PARTICIPANTS.getCode()
            );
        }

        Set<String> fullNames = new HashSet<>();
        for (Participant p : participants) {
            if (p.getFullName() == null || p.getFullName().trim().isEmpty()) {
                throw new BookingException(
                        BookingErrorCode.INVALID_PARTICIPANT.getMessage(),
                        HttpStatus.BAD_REQUEST,
                        BookingErrorCode.INVALID_PARTICIPANT.getCode()
                );
            }
            if (p.getFullName().length() < 2) {
                throw new BookingException(
                        "Tên người tham gia phải có ít nhất 2 ký tự",
                        HttpStatus.BAD_REQUEST,
                        "BOOKING_017"
                );
            }
            if (!p.getFullName().matches("^[a-zA-Z\\sÀ-ỹ]+$")) {
                throw new BookingException(
                        "Tên người tham gia chỉ được chứa chữ cái và khoảng trắng",
                        HttpStatus.BAD_REQUEST,
                        "BOOKING_018"
                );
            }
            if (p.getGender() == null) {
                throw new BookingException(
                        "Giới tính không được để trống",
                        HttpStatus.BAD_REQUEST,
                        "BOOKING_026"
                );
            }
            if (p.getAgeType() == null) {
                throw new BookingException(
                        "Loại tuổi không được để trống",
                        HttpStatus.BAD_REQUEST,
                        "BOOKING_027"
                );
            }
            if (!fullNames.add(p.getFullName().toLowerCase())) {
                throw new BookingException(
                        "Người tham gia trùng lặp: " + p.getFullName(),
                        HttpStatus.BAD_REQUEST,
                        "BOOKING_020"
                );
            }
        }
    }

    private Booking prepareBooking(Booking request, UserDTO user, LightTourDTO tour) {
        String bookingCode = generateBookingCode(user, tour);
        Booking booking = Booking.builder()
                .userId(request.getUserId())
                .tourId(request.getTourId())
                .bookingCode(bookingCode)
                .bookingDate(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .paymentDueTime(LocalDateTime.now().plusHours(PAYMENT_DUE_HOURS))
                .bookingStatus(BookingStatus.PENDING)
                .participants(new ArrayList<>())
                .build();

        if (request.getParticipants() != null) {
            List<Participant> participants = request.getParticipants().stream()
                    .map(p -> buildParticipant(p, booking))
                    .toList();
            booking.getParticipants().addAll(participants);
        }
        booking.calculateTotalPrice(tour.getPrice());
        return booking;
    }

    private String generateBookingCode(UserDTO user, LightTourDTO tour) {
        String firstLetter = Optional.ofNullable(user.getFullName())
                .filter(name -> !name.isEmpty())
                .map(name -> name.substring(0, 1).toUpperCase())
                .orElse("U");
        String tourCodePrefix = Optional.ofNullable(tour.getTourCode())
                .map(code -> code.length() >= 4 ? code.substring(0, 4) : code)
                .orElse("TOUR");
        String uniqueId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return String.format("BK%s%s%s", firstLetter, tourCodePrefix, uniqueId);
    }

    private Participant buildParticipant(Participant request, Booking booking) {
        return Participant.builder()
                .fullName(request.getFullName())
                .gender(request.getGender())
                .ageType(request.getAgeType())
                .booking(booking)
                .build();
    }

    private void updateTourParticipants(LightTourDTO tour, int participantChange, boolean isAdding) {
        if (tour.getTourId() == null) {
            throw new BookingException(
                    "Tour ID không được null",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_014"
            );
        }

        int currentParticipants = tour.getCurrentParticipants() != null ? tour.getCurrentParticipants() : 0;
        int newParticipants = isAdding ? currentParticipants + participantChange : participantChange;

        if (newParticipants < 0 || newParticipants > tour.getMaxParticipants()) {
            throw new BookingException(
                    isAdding ? "Không còn đủ chỗ cho số lượng người tham gia" : "Số lượng người tham gia không hợp lệ sau khi hủy",
                    HttpStatus.BAD_REQUEST,
                    isAdding ? "BOOKING_013" : "BOOKING_033"
            );
        }

        try {
            Map<String, Integer> requestBody = Map.of("currentParticipants", newParticipants);
            catalogClient.updateCurrentParticipants(tour.getTourId(), requestBody);
            tour.setCurrentParticipants(newParticipants);
            logger.info("Updated tour {} with new participant count: {}", tour.getTourCode(), newParticipants);
        } catch (Exception e) {
            logger.error("Failed to update tour participants for tour {}: {}", tour.getTourCode(), e.getMessage());
            throw new BookingException(
                    "Không thể cập nhật số lượng người tham gia",
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "BOOKING_034"
            );
        }
    }

    private void validateStatusTransition(BookingStatus currentStatus, BookingStatus newStatus) {
        if (currentStatus == BookingStatus.COMPLETED) {
            throw new BookingException(
                    "Không thể chuyển trạng thái từ COMPLETED",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_030"
            );
        }
        if (newStatus == BookingStatus.COMPLETED) {
            throw new BookingException(
                    "Không thể chuyển trạng thái sang COMPLETED thủ công. Hệ thống sẽ tự động cập nhật sau khi tour bắt đầu 1 giây.",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_042"
            );
        }
        if (currentStatus == BookingStatus.CANCELLED && newStatus != BookingStatus.CANCELLED) {
            throw new BookingException(
                    "Không thể chuyển trạng thái khi đang là CANCELLED",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_032"
            );
        }
    }

    private void validateCancelRequest(Booking booking, CancelReason reason) {
        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new InvalidBookingStatusException(booking.getBookingStatus(), BookingStatus.CANCELLED);
        }
        if (booking.getBookingStatus() == BookingStatus.COMPLETED) {
            throw new BookingException(
                    "Không thể hủy booking đã hoàn thành",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_038"
            );
        }
        if (booking.getBookingStatus() == BookingStatus.CONFIRMED && reason == null) {
            throw new BookingException(
                    "Phải cung cấp lý do khi hủy booking đã xác nhận",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_036"
            );
        }
    }

    private int calculateNewParticipantCount(LightTourDTO tour, int participantsToRemove) {
        int currentParticipants = tour.getCurrentParticipants() != null ? tour.getCurrentParticipants() : 0;
        int newParticipants = currentParticipants - participantsToRemove;
        if (newParticipants < 0) {
            logger.error("Invalid participant count for tour {}: {}", tour.getTourCode(), newParticipants);
            throw new BookingException(
                    "Số lượng người tham gia không hợp lệ sau khi hủy",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_033"
            );
        }
        return newParticipants;
    }

    private void updateBookingForCancellation(Booking booking, CancelReason reason, CanceledBy canceledBy, LightTourDTO tour) {
        logger.info("Updating booking {} for cancellation: status={}, canceledBy={}, reason={}",
                booking.getBookingCode(), booking.getBookingStatus(), canceledBy, reason);

        booking.setBookingStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        booking.setPaymentDueTime(null);
        booking.setRefundReason(reason);
        booking.setCanceledBy(canceledBy);

        if (booking.getBookingStatus() == BookingStatus.CONFIRMED) {
            handleRefundPolicy(booking, canceledBy, reason, tour);
            logger.info("Applied refund policy for booking {} in CONFIRMED status", booking.getBookingCode());
        } else {
            booking.setRefundStatus(RefundStatus.NONE);
            booking.setRefundAmount(0.0);
            logger.info("No refund for booking {}: status is not CONFIRMED (current status: {})",
                    booking.getBookingCode(), booking.getBookingStatus());
        }

        logger.info("Preparing to send cancellation email for booking {}", booking.getBookingCode());
        sendBookingCancellationNotificationAsync(booking, fetchUser(booking.getUserId()), tour,
                reason != null ? reason.getDescription() : "Không có lý do cụ thể");
    }

    private void handleRefundPolicy(Booking booking, CanceledBy canceledBy, CancelReason reason, LightTourDTO tour) {
        logger.info("Handling refund policy for booking {}: canceledBy={}, reason={}, totalPrice={}",
                booking.getBookingCode(), canceledBy, reason, booking.getTotalPrice());

        if (booking.getTotalPrice() == null || booking.getTotalPrice() <= 0) {
            logger.warn("Total price is invalid for booking {}: {}", booking.getBookingCode(), booking.getTotalPrice());
            booking.setRefundStatus(RefundStatus.NONE);
            booking.setRefundAmount(0.0);
            return;
        }

        if (canceledBy == CanceledBy.ADMIN) {
            if (reason == CancelReason.TOUR_QUALITY_CONCERN ||
                    reason == CancelReason.WEATHER_CONDITION ||
                    reason == CancelReason.OPERATIONAL_ISSUE ||
                    reason == CancelReason.LEGAL_RESTRICTION) {
                booking.setRefundStatus(RefundStatus.PENDING);
                booking.setRefundAmount(booking.getTotalPrice() * FULL_REFUND_RATE);
                logger.info("Initiated 100% refund for booking {} due to reason: {}", booking.getBookingCode(), reason);
            } else if (reason == CancelReason.PERSONAL_REASON || reason == CancelReason.SCHEDULE_CONFLICT || reason == CancelReason.FINANCIAL_ISSUE) {
                booking.setRefundStatus(RefundStatus.PENDING);
                booking.setRefundAmount(booking.getTotalPrice() * HALF_REFUND_RATE);
                logger.info("Initiated 50% refund for booking {} due to reason: {}", booking.getBookingCode(), reason);
            } else {
                booking.setRefundStatus(RefundStatus.NONE);
                booking.setRefundAmount(0.0);
                logger.info("No refund for booking {} due to reason: {}", booking.getBookingCode(), reason);
            }
        } else if (canceledBy == CanceledBy.USER) {
            long timeToStart = tour.getStartDate().getTime() - new Date().getTime();
            if (timeToStart > THREE_DAYS_IN_MILLIS) {
                booking.setRefundStatus(RefundStatus.PENDING);
                booking.setRefundAmount(booking.getTotalPrice() * HALF_REFUND_RATE);
                logger.info("Initiated 50% refund for booking {} (canceled before 3 days)", booking.getBookingCode());
            } else {
                booking.setRefundStatus(RefundStatus.NONE);
                booking.setRefundAmount(0.0);
                logger.info("No refund for booking {} (canceled within 3 days)", booking.getBookingCode());
            }
        } else if (canceledBy == CanceledBy.SYSTEM) {
            booking.setRefundStatus(RefundStatus.NONE);
            booking.setRefundAmount(0.0);
            logger.info("No refund for booking {}: cancelled by SYSTEM due to payment timeout", booking.getBookingCode());
        }
    }

    private BookingResponseDTO convertToResponseDTO(Booking booking, LightTourDTO tour, UserDTO user) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setBookingCode(booking.getBookingCode());
        dto.setUser(user);
        dto.setTour(convertToTourDTO(tour));
        dto.setTourCode(tour.getTourCode());
        dto.setBookingDate(booking.getBookingDate());
        dto.setUpdatedAt(booking.getUpdatedAt());
        dto.setPaymentDueTime(booking.getPaymentDueTime());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setBookingStatus(booking.getBookingStatus());
        dto.setNotes(booking.getNotes());
        dto.setPaymentDueTimeRelevant(booking.getBookingStatus() == BookingStatus.PENDING);
        dto.setRefundReason(booking.getRefundReason());
        dto.setRefundAmount(booking.getRefundAmount());
        dto.setRefundStatus(booking.getRefundStatus());
        dto.setCanceledBy(booking.getCanceledBy());

        List<BookingResponseDTO.ParticipantInfo> participantInfos = booking.getParticipants().stream()
                .map(p -> {
                    BookingResponseDTO.ParticipantInfo info = new BookingResponseDTO.ParticipantInfo();
                    info.setId(p.getId());
                    info.setFullName(p.getFullName());
                    info.setGender(p.getGender());
                    info.setAgeType(p.getAgeType());
                    return info;
                }).toList();

        dto.setParticipants(participantInfos);
        return dto;
    }

    private TourDTO convertToTourDTO(LightTourDTO lightTour) {
        TourDTO tourDTO = new TourDTO();
        tourDTO.setTourId(lightTour.getTourId());
        tourDTO.setTourCode(lightTour.getTourCode());
        tourDTO.setTitle(lightTour.getTitle());
        tourDTO.setPrice(lightTour.getPrice());
        tourDTO.setMaxParticipants(lightTour.getMaxParticipants());
        tourDTO.setCurrentParticipants(lightTour.getCurrentParticipants());
        tourDTO.setStartDate(lightTour.getStartDate());
        return tourDTO;
    }

    private void broadcastBookingEvent(String topic, BookingResponseDTO response, String bookingCode) {
        try {
            messagingTemplate.convertAndSend(topic, response);
            logger.info("Broadcasted event to {} for booking: {}", topic, bookingCode);
        } catch (Exception e) {
            logger.error("Failed to send WebSocket message to {} for booking {}: {}", topic, bookingCode, e.getMessage());
        }
    }

    @Async
    public void sendBookingConfirmationAsync(Booking booking, UserDTO user, LightTourDTO tour) {
        try {
            emailService.sendBookingConfirmation(booking, user, convertToTourDTO(tour));
            logger.info("Sent booking confirmation email for booking: {}", booking.getBookingCode());
        } catch (Exception e) {
            logger.error("Failed to send booking confirmation email for booking {}: {}", booking.getBookingCode(), e.getMessage());
        }
    }

    @Async
    public void sendBookingCancellationNotificationAsync(Booking booking, UserDTO user, LightTourDTO tour, String reason) {
        try {
            emailService.sendBookingCancellationNotification(booking, user, convertToTourDTO(tour), reason);
            logger.info("Sent cancellation notification for booking: {}", booking.getBookingCode());
        } catch (Exception e) {
            logger.error("Failed to send cancellation notification for booking {}: {}", booking.getBookingCode(), e.getMessage());
            logger.error("Exception details: ", e);
        }
    }

    @Async
    public void sendPaymentConfirmationAsync(Booking booking, UserDTO user, LightTourDTO tour) {
        try {
            emailService.sendPaymentConfirmation(booking, booking.getBookingCode());
            logger.info("Sent payment confirmation email for booking: {}", booking.getBookingCode());
        } catch (Exception e) {
            logger.error("Failed to send payment confirmation email for booking {}: {}", booking.getBookingCode(), e.getMessage());
            logger.error("Exception details: ", e);
        }
    }
}