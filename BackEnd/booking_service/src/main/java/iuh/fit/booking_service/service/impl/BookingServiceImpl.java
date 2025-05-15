
package iuh.fit.booking_service.service.impl;

import iuh.fit.booking_service.client.catalog.CatalogClient;
//import iuh.fit.booking_service.client.payment.PaymentClient;
import iuh.fit.booking_service.client.payment.PaymentClient;
import iuh.fit.booking_service.client.user.UserClient;
<<<<<<< HEAD
import iuh.fit.booking_service.dto.BookingResponseDTO;
import iuh.fit.booking_service.dto.LightTourDTO;
import iuh.fit.booking_service.dto.TourDTO;
import iuh.fit.booking_service.dto.UserDTO;
import iuh.fit.booking_service.entity.AgeType;
import iuh.fit.booking_service.entity.Booking;
import iuh.fit.booking_service.entity.BookingStatus;
import iuh.fit.booking_service.entity.Participant;
=======
import iuh.fit.booking_service.dto.*;
import iuh.fit.booking_service.entity.*;
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
import iuh.fit.booking_service.exception.BookingException;
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
<<<<<<< HEAD
import org.springframework.scheduling.annotation.Async;
=======
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
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
    private static final int PAYMENT_DUE_HOURS = 48;

    private final BookingRepository bookingRepository;
    private final EmailService emailService;
    private final CatalogClient catalogClient;
    private final UserClient userClient;
    private final PaymentClient paymentClient;



    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public BookingResponseDTO createBooking(Booking bookingRequest) {
        logger.info("Creating booking for tourId: {}, userId: {}",
                bookingRequest != null ? bookingRequest.getTourId() : null,
                bookingRequest != null ? bookingRequest.getUserId() : null);

        validateBookingRequest(bookingRequest);
<<<<<<< HEAD

        LightTourDTO tour = fetchTour(bookingRequest.getTourId());
=======
        LightTourDTO tour = fetchTour(bookingRequest.getTourId());
        if (tour.getTourId() == null) {
            throw new BookingException(
                    BookingErrorCode.TOUR_NOT_FOUND.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.TOUR_NOT_FOUND.getCode()
            );
        }
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
        UserDTO user = fetchUser(bookingRequest.getUserId());
        if (user.getId() == null) {
            throw new BookingException(
                    BookingErrorCode.USER_NOT_FOUND.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.USER_NOT_FOUND.getCode()
            );
        }
        validateTour(tour);

<<<<<<< HEAD
        Booking savedBooking = bookingRepository.save(prepareBooking(bookingRequest, user, tour));
        updateTourParticipants(tour, bookingRequest.getParticipants().size());
        sendBookingConfirmationAsync(savedBooking, user, tour);

        logger.info("Booking created successfully with code: {}", savedBooking.getBookingCode());
        return convertToResponseDTO(savedBooking, tour, user);
=======
        Booking existingBooking = bookingRepository.findBookingByTourIdAndUserId(
                bookingRequest.getTourId(), bookingRequest.getUserId());
        if (existingBooking != null) {
            if (existingBooking.getBookingStatus() == BookingStatus.PENDING ||
                    existingBooking.getBookingStatus() == BookingStatus.CONFIRMED ||
                    existingBooking.getBookingStatus() == BookingStatus.COMPLETED) {
                throw new BookingException(
                        BookingErrorCode.DUPLICATE_BOOKING.getMessage(),
                        HttpStatus.CONFLICT,
                        BookingErrorCode.DUPLICATE_BOOKING.getCode()
                );
            }
        }

        validateParticipants(bookingRequest.getParticipants());
        Booking newBooking = prepareBooking(bookingRequest, user, tour);

        int totalParticipants = bookingRepository.countTotalParticipantsByTourId(bookingRequest.getTourId());
        int remaining = tour.getMaxParticipants() - totalParticipants;
        if (newBooking.getParticipants().size() > remaining) {
            throw new BookingException(
                    BookingErrorCode.INSUFFICIENT_SEATS.getMessage() + ": " + remaining,
                    HttpStatus.CONFLICT,
                    BookingErrorCode.INSUFFICIENT_SEATS.getCode()
            );
        }

        Booking savedBooking;
        try {
            savedBooking = bookingRepository.save(newBooking);
            logger.info("Saved new booking with code: {}", savedBooking.getBookingCode());
        } catch (Exception e) {
            logger.error("Failed to save booking: {}", e.getMessage(), e);
            throw new BookingException(
                    "Failed to save booking due to database error",
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    BookingErrorCode.INTERNAL_ERROR.getCode()
            );
        }

        try {
            updateTourParticipants(tour, savedBooking.getParticipants().size(), true);
            logger.info("Updated tour participants for tour: {}", tour.getTourId());
        } catch (Exception e) {
            logger.error("Failed to update tour participants: {}", e.getMessage(), e);
            throw new BookingException(
                    BookingErrorCode.UPDATE_PARTICIPANTS_FAILED.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    BookingErrorCode.UPDATE_PARTICIPANTS_FAILED.getCode()
            );
        }

        BookingResponseDTO response = convertToResponseDTO(savedBooking, tour, user);
        broadcastBookingEvent(BOOKING_TOPIC, response, savedBooking.getBookingCode());

        PaymentMethodDTO paymentMethodDTO = paymentClient.getPaymentMethodsById(savedBooking.getPaymentMethodId());
        if (paymentMethodDTO == null) {
            throw new BookingException(
                    "ID phương thức thanh toán không hợp lệ",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_PAYMENT_METHOD_INVALID"
            );
        }
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setBookingId(savedBooking.getId());
        paymentDTO.setAmount(savedBooking.getTotalPrice());
        paymentDTO.setUserId(savedBooking.getUserId());
        paymentDTO.setMethodId(savedBooking.getPaymentMethodId());
        paymentDTO.setStatus("PENDING");
        paymentClient.createPayment(paymentDTO);

        sendBookingConfirmationAsync(savedBooking, user, tour);

        logger.info("Booking created successfully with code: {}", savedBooking.getBookingCode());
        return response;
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
    }
    @Override
    @Transactional(readOnly = true)
    public Booking getBooking(Long id) {
        logger.info("Fetching booking with id: {}", id);
<<<<<<< HEAD
        return bookingRepository.findByIdWithParticipants(id)
                .orElseThrow(() -> new BookingException("Booking không tồn tại", HttpStatus.NOT_FOUND, "BOOKING_003"));
=======
        if (id == null) {
            throw new BookingException(
                    "Booking ID is required",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_013"
            );
        }
        return bookingRepository.findByIdWithParticipants(id)
                .orElseThrow(() -> new BookingException(
                        BookingErrorCode.NOT_FOUND.getMessage(),
                        HttpStatus.NOT_FOUND,
                        BookingErrorCode.NOT_FOUND.getCode()
                ));
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponseDTO> getAllBookings(Pageable pageable) {
        logger.info("Fetching bookings with page: {}, size: {}", pageable.getPageNumber(), pageable.getPageSize());
<<<<<<< HEAD
        Page<Booking> bookings = bookingRepository.findAll(pageable);
        return bookings.map(booking -> {
            LightTourDTO tour = fetchTour(booking.getTourId());
            UserDTO user = fetchUser(booking.getUserId());
            return convertToResponseDTO(booking, tour, user);
        });
=======
        if (pageable == null) {
            throw new BookingException(
                    "Pageable is required",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_015"
            );
        }
        return bookingRepository.findAll(pageable)
                .map(booking -> {
                    try {
                        return convertToResponseDTO(
                                booking,
                                fetchTour(booking.getTourId()),
                                fetchUser(booking.getUserId())
                        );
                    } catch (Exception e) {
                        logger.error("Failed to convert booking {}: {}", booking.getId(), e.getMessage(), e);
                        throw new BookingException(
                                "Failed to fetch booking details",
                                HttpStatus.INTERNAL_SERVER_ERROR,
                                BookingErrorCode.INTERNAL_ERROR.getCode()
                        );
                    }
                });
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
    }

    @Override
    @Transactional
    public BookingResponseDTO updateBookingStatus(Long id, BookingStatus newStatus) {
        logger.info("Updating booking status for id: {} to {}", id, newStatus);
        if (id == null || newStatus == null) {
            throw new BookingException(
                    "Booking ID and new status are required",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_016"
            );
        }
        Booking booking = getBooking(id);
        validateStatusTransition(booking.getBookingStatus(), newStatus);

        booking.setBookingStatus(newStatus);
        booking.setUpdatedAt(LocalDateTime.now());
        if (newStatus != BookingStatus.PENDING) {
            booking.setPaymentDueTime(null);
        }

<<<<<<< HEAD
        Booking updatedBooking = bookingRepository.save(booking);
        return convertToResponseDTO(updatedBooking, fetchTour(booking.getTourId()), fetchUser(booking.getUserId()));
    }

    @Override
    @Transactional
    public BookingResponseDTO cancelBooking(Long id, String reason) {
        logger.info("Cancelling booking with id: {}, reason: {}", id, reason);
        Booking booking = getBooking(id);
        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new InvalidBookingStatusException(booking.getBookingStatus(), BookingStatus.CANCELLED);
=======
        Booking updatedBooking;
        try {
            updatedBooking = bookingRepository.save(booking);
        } catch (Exception e) {
            logger.error("Failed to update booking status: {}", e.getMessage(), e);
            throw new BookingException(
                    "Failed to update booking status due to database error",
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    BookingErrorCode.INTERNAL_ERROR.getCode()
            );
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
        }

        LightTourDTO tour = fetchTour(updatedBooking.getTourId());
        UserDTO user = fetchUser(updatedBooking.getUserId());
        BookingResponseDTO response = convertToResponseDTO(updatedBooking, tour, user);

<<<<<<< HEAD
        Booking cancelledBooking = bookingRepository.save(booking);
        return convertToResponseDTO(cancelledBooking, fetchTour(booking.getTourId()), fetchUser(booking.getUserId()));
=======
        if (newStatus == BookingStatus.CONFIRMED) {
            logger.info("Booking status updated to CONFIRMED for booking {}. Sending payment confirmation email.",
                    updatedBooking.getBookingCode());
            sendPaymentConfirmationAsync(updatedBooking, user, tour);
        }

        broadcastBookingEvent(UPDATE_TOPIC, response, updatedBooking.getBookingCode());
        return response;
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
    }

    @Override
    @Transactional
    public BookingResponseDTO cancelBooking(Long id, CancelReason reason, CanceledBy canceledBy) {
        logger.info("Cancelling booking with id: {}, reason: {}, canceledBy: {}", id, reason, canceledBy);
        if (id == null || canceledBy == null) {
            throw new BookingException(
                    "Booking ID and canceledBy are required",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_017"
            );
        }
        Booking booking = getBooking(id);
        validateCancelRequest(booking, reason);

        LightTourDTO tour = fetchTour(booking.getTourId());
        UserDTO user = fetchUser(booking.getUserId());
        int participantsToRemove = booking.getParticipants().size();

        int newParticipants = calculateNewParticipantCount(tour, participantsToRemove);



        PaymentDTO payment = paymentClient.getPaymentByBookingId(booking.getId());
        if (booking.getBookingStatus() == BookingStatus.CONFIRMED) {
            logger.info("Booking {} is CONFIRMED. Updating payment {} to REFUND and creating a refund.", booking.getBookingCode(), payment.getId());
            paymentClient.refundPayment(payment.getId());
            createRefundForPayment(payment, reason);
        }
        else{
            paymentClient.cancelPayment(payment.getId());
        }
        updateBookingForCancellation(booking, reason, canceledBy, tour);
        Booking cancelledBooking;
        try {
            cancelledBooking = bookingRepository.save(booking);
            logger.info("Successfully cancelled booking with code: {}", cancelledBooking.getBookingCode());
        } catch (Exception e) {
            logger.error("Failed to save cancelled booking: {}", e.getMessage(), e);
            throw new BookingException(
                    "Failed to cancel booking due to database error",
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    BookingErrorCode.INTERNAL_ERROR.getCode()
            );
        }

        try {
            updateTourParticipants(tour, newParticipants, false);
            logger.info("Updated tour participants for tour ID: {} after cancellation.", tour.getTourId());
        } catch (Exception e) {
            logger.error("Failed to update tour participants after cancellation: {}", e.getMessage(), e);
            throw new BookingException(
                    BookingErrorCode.UPDATE_PARTICIPANTS_FAILED.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    BookingErrorCode.UPDATE_PARTICIPANTS_FAILED.getCode()
            );
        }

        BookingResponseDTO response = convertToResponseDTO(cancelledBooking, tour, user);
        broadcastBookingEvent(UPDATE_TOPIC, response, cancelledBooking.getBookingCode());
        return response;
    }

    private void createRefundForPayment(PaymentDTO payment, CancelReason reason) {
        RefundDTO refund = new RefundDTO();
        refund.setReason(reason != null ? reason.name() : "UNKNOWN");
        refund.setStatus("PENDING");
        refund.setPaymentId(payment.getId());
        refund.setCreatedAt(LocalDateTime.now());
        paymentClient.createRefundPayment(refund);
        logger.info("Created refund for payment ID: {} with reason: {}", payment.getId(), refund.getReason());
    }
    @Override
    @Transactional
    public BookingResponseDTO userCancelBooking(Long id, CancelReason reason, Long userId) {
        logger.info("User {} cancelling booking with id: {}, reason: {}", userId, id, reason);

        if (id == null || userId == null) {
            throw new BookingException(
                    "Booking ID and user ID are required",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_018"
            );
        }
        if (reason == null) {
            throw new BookingException(
                    BookingErrorCode.MISSING_CANCEL_REASON.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.MISSING_CANCEL_REASON.getCode()
            );
        }

        // Fetch and validate booking
        Booking booking = getBooking(id);
        if (!booking.getUserId().equals(userId)) {
            throw new BookingException(
                    BookingErrorCode.UNAUTHORIZED_CANCEL.getMessage(),
                    HttpStatus.FORBIDDEN,
                    BookingErrorCode.UNAUTHORIZED_CANCEL.getCode()
            );
        }

        // Validate cancellation request
        validateCancelRequest(booking, reason);

        // Fetch tour and user details
        LightTourDTO tour = fetchTour(booking.getTourId());
        UserDTO user = fetchUser(booking.getUserId());
        int participantsToRemove = booking.getParticipants().size();

        // Calculate new participant count for the tour
        int newParticipants = calculateNewParticipantCount(tour, participantsToRemove);

        // Handle payment (same logic as cancelBooking)
        PaymentDTO payment = paymentClient.getPaymentByBookingId(booking.getId());
        if (booking.getBookingStatus() == BookingStatus.CONFIRMED) {
            logger.info("Booking {} is CONFIRMED. Updating payment {} to REFUND and creating a refund.",
                    booking.getBookingCode(), payment.getId());
            paymentClient.refundPayment(payment.getId());
            createRefundForPayment(payment, reason);
        } else {
            paymentClient.cancelPayment(payment.getId());
        }

        // Update booking for cancellation
        updateBookingForCancellation(booking, reason, CanceledBy.USER, tour);

        // Save the updated booking
        Booking cancelledBooking;
        try {
            cancelledBooking = bookingRepository.save(booking);
            logger.info("Successfully cancelled booking with code: {}", cancelledBooking.getBookingCode());
        } catch (Exception e) {
            logger.error("Failed to save cancelled booking: {}", e.getMessage(), e);
            throw new BookingException(
                    "Failed to cancel booking due to database error",
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    BookingErrorCode.INTERNAL_ERROR.getCode()
            );
        }

        // Update tour participants
        try {
            updateTourParticipants(tour, newParticipants, false);
            logger.info("Updated tour participants for tour ID: {} after cancellation.", tour.getTourId());
        } catch (Exception e) {
            logger.error("Failed to update tour participants after cancellation: {}", e.getMessage(), e);
            throw new BookingException(
                    BookingErrorCode.UPDATE_PARTICIPANTS_FAILED.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    BookingErrorCode.UPDATE_PARTICIPANTS_FAILED.getCode()
            );
        }

        // Convert to response DTO and broadcast event
        BookingResponseDTO response = convertToResponseDTO(cancelledBooking, tour, user);
        broadcastBookingEvent(UPDATE_TOPIC, response, cancelledBooking.getBookingCode());

        return response;
    }
    @Override
    @Transactional(readOnly = true)
    public boolean canUserBookTour(Long tourId, Long userId) {
        logger.debug("Checking if user {} can book tour {}", userId, tourId);
        if (tourId == null || userId == null) {
            throw new BookingException(
                    "Tour ID and user ID are required",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_019"
            );
        }
        Booking existing = bookingRepository.findBookingByTourIdAndUserId(tourId, userId);
        return existing == null || existing.getBookingStatus() == BookingStatus.CANCELLED;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getAllBookingByUser(Long userId) {
        logger.info("Fetching bookings for user: {}", userId);
        if (userId == null) {
            throw new BookingException(
                    "User ID is required",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_020"
            );
        }
        List<Booking> bookings = bookingRepository.findBookingByUserId(userId);
        return bookings.stream()
                .map(booking -> {
                    try {
                        LightTourDTO tour = fetchTour(booking.getTourId());
                        UserDTO user = fetchUser(booking.getUserId());
                        return convertToResponseDTO(booking, tour, user);
                    } catch (Exception e) {
                        logger.error("Failed to convert booking {} for user {}: {}",
                                booking.getId(), userId, e.getMessage(), e);
                        throw new BookingException(
                                "Failed to fetch booking details",
                                HttpStatus.INTERNAL_SERVER_ERROR,
                                BookingErrorCode.INTERNAL_ERROR.getCode()
                        );
                    }
                })
                .toList();
    }
    @Override
    @Transactional(readOnly = true)
    public List<Booking> getBookingsByStatus(BookingStatus status) {
        logger.info("Fetching bookings with status: {}", status);
        if (status == null) {
            throw new BookingException(
                    "Booking status is required",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_021"
            );
        }
        return bookingRepository.findBookingByBookingStatus(status);
    }

    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void completeStartedBookings() {
        logger.info("Checking for bookings to complete based on tour start date");
        List<Booking> confirmedBookings = bookingRepository.findBookingByBookingStatus(BookingStatus.CONFIRMED);
        Date now = new Date();

        for (Booking booking : confirmedBookings) {
            try {
                LightTourDTO tour = fetchTour(booking.getTourId());
                if (tour.getStartDate() != null && tour.getStartDate().getTime() + 1000 <= now.getTime()) {
                    booking.setBookingStatus(BookingStatus.COMPLETED);
                    booking.setUpdatedAt(LocalDateTime.now());
                    booking.setPaymentDueTime(null);
                    bookingRepository.save(booking);
                    logger.info("Updated booking {} to COMPLETED for tour {}",
                            booking.getBookingCode(), tour.getTourCode());

                    UserDTO user = fetchUser(booking.getUserId());
                    BookingResponseDTO response = convertToResponseDTO(booking, tour, user);
                    broadcastBookingEvent(UPDATE_TOPIC, response, booking.getBookingCode());
                }
            } catch (Exception e) {
                logger.error("Failed to complete booking {}: {}", booking.getBookingCode(), e.getMessage(), e);
            }
        }
    }

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void cancelOverdueBookings() {
        logger.info("Checking for overdue bookings to cancel");
        List<Booking> pendingBookings = bookingRepository.findBookingByBookingStatus(BookingStatus.PENDING);
        LocalDateTime now = LocalDateTime.now();

        for (Booking booking : pendingBookings) {
            try {
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
                    logger.info("Automatically cancelled overdue booking {} due to payment timeout",
                            booking.getBookingCode());
                }
            } catch (Exception e) {
                logger.error("Failed to cancel overdue booking {}: {}", booking.getBookingCode(), e.getMessage(), e);
            }
        }
    }

    private void validateBookingRequest(Booking booking) {
        if (booking == null) {
            throw new BookingException(
                    "Booking request cannot be null",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_022"
            );
        }
        if (booking.getTourId() == null || booking.getUserId() == null) {
            throw new BookingException(
                    BookingErrorCode.MISSING_IDS.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.MISSING_IDS.getCode()
            );
        }
        if (booking.getParticipants() == null) {
            throw new BookingException(
                    BookingErrorCode.NO_PARTICIPANTS.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.NO_PARTICIPANTS.getCode()
            );
        }
    }

    @Cacheable(value = "tours", key = "#tourId")
    public LightTourDTO fetchTour(Long tourId) {
        logger.info("Fetching tour with id: {}", tourId);
<<<<<<< HEAD
        LightTourDTO tour = catalogClient.getTourById(tourId);
        if (tour == null) {
            throw new BookingException("Tour không tồn tại", HttpStatus.NOT_FOUND, "BOOKING_010");
=======
        if (tourId == null) {
            throw new BookingException(
                    BookingErrorCode.INVALID_TOUR_ID.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.INVALID_TOUR_ID.getCode()
            );
        }
        try {
            LightTourDTO tour = catalogClient.getTourById(tourId);
            if (tour == null) {
                throw new BookingException(
                        BookingErrorCode.TOUR_NOT_FOUND.getMessage(),
                        HttpStatus.NOT_FOUND,
                        BookingErrorCode.TOUR_NOT_FOUND.getCode()
                );
            }
            return tour;
        } catch (Exception e) {
            logger.error("Failed to fetch tour {}: {}", tourId, e.getMessage(), e);
            throw new BookingException(
                    "Failed to fetch tour from catalog service",
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "BOOKING_023"
            );
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
        }
    }

    @Cacheable(value = "users", key = "#userId")
    public UserDTO fetchUser(Long userId) {
        logger.info("Fetching user with id: {}", userId);
        if (userId == null) {
            throw new BookingException(
                    "User ID is required",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_024"
            );
        }
<<<<<<< HEAD
        return user;
    }

    private void validateBooking(LightTourDTO tour, UserDTO user, Booking booking) {
        validateTour(tour);
        validateParticipants(booking.getParticipants());
        if (!canUserBookTour(booking.getTourId(), booking.getUserId())) {
            throw new BookingException("Bạn đã có booking cho tour này rồi", HttpStatus.CONFLICT, "BOOKING_002");
        }

        int totalParticipants = bookingRepository.countTotalParticipantsByTourId(booking.getTourId());
        int remaining = tour.getMaxParticipants() - totalParticipants;
        if (booking.getParticipants().size() > remaining) {
            throw new BookingException("Tour không đủ chỗ. Số chỗ còn lại: " + remaining,
                    HttpStatus.CONFLICT, "BOOKING_005");
=======
        try {
            UserDTO user = userClient.getUserById(userId);
            if (user == null) {
                throw new BookingException(
                        BookingErrorCode.USER_NOT_FOUND.getMessage(),
                        HttpStatus.NOT_FOUND,
                        BookingErrorCode.USER_NOT_FOUND.getCode()
                );
            }
            return user;
        } catch (Exception e) {
            logger.error("Failed to fetch user {}: {}", userId, e.getMessage(), e);
            throw new BookingException(
                    "Failed to fetch user from user service",
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "BOOKING_025"
            );
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
        }
    }

    private void validateTour(LightTourDTO tour) {
<<<<<<< HEAD
=======
        if (tour == null) {
            throw new BookingException(
                    BookingErrorCode.TOUR_NOT_FOUND.getMessage(),
                    HttpStatus.NOT_FOUND,
                    BookingErrorCode.TOUR_NOT_FOUND.getCode()
            );
        }
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
        Date now = new Date();
        if (tour.getPrice() <= 0) {
            throw new BookingException(
                    BookingErrorCode.INVALID_PRICE.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.INVALID_PRICE.getCode()
            );
        }
        if (tour.getMaxParticipants() <= 0) {
            throw new BookingException(
                    BookingErrorCode.INVALID_MAX_PARTICIPANTS.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.INVALID_MAX_PARTICIPANTS.getCode()
            );
        }
        if (tour.getStartDate() == null) {
            throw new BookingException(
                    "Tour start date is required",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_026"
            );
        }
<<<<<<< HEAD
        if (tour.getStartDate() != null && tour.getStartDate().before(new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000))) {
            throw new BookingException("Phải đặt tour ít nhất 3 ngày trước khi khởi hành",
                    HttpStatus.BAD_REQUEST, "BOOKING_008");
=======
        if (tour.getStartDate().before(now)) {
            throw new BookingException(
                    BookingErrorCode.TOUR_STARTED.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.TOUR_STARTED.getCode()
            );
        }
        if (tour.getStartDate().before(new Date(now.getTime() + THREE_DAYS_IN_MILLIS))) {
            throw new BookingException(
                    BookingErrorCode.BOOKING_TOO_LATE.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.BOOKING_TOO_LATE.getCode()
            );
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
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
            if (p == null) {
                throw new BookingException(
                        BookingErrorCode.INVALID_PARTICIPANT.getMessage(),
                        HttpStatus.BAD_REQUEST,
                        BookingErrorCode.INVALID_PARTICIPANT.getCode()
                );
            }
            if (p.getFullName() == null || p.getFullName().trim().isEmpty()) {
                throw new BookingException(
                        BookingErrorCode.INVALID_PARTICIPANT.getMessage(),
                        HttpStatus.BAD_REQUEST,
                        BookingErrorCode.INVALID_PARTICIPANT.getCode()
                );
            }
            if (p.getFullName().length() < 2) {
                throw new BookingException(
                        BookingErrorCode.INVALID_PARTICIPANT_NAME_LENGTH.getMessage(),
                        HttpStatus.BAD_REQUEST,
                        BookingErrorCode.INVALID_PARTICIPANT_NAME_LENGTH.getCode()
                );
            }
            if (!p.getFullName().matches("^[a-zA-Z\\sÀ-ỹ]+$")) {
                throw new BookingException(
                        BookingErrorCode.INVALID_PARTICIPANT_NAME_FORMAT.getMessage(),
                        HttpStatus.BAD_REQUEST,
                        BookingErrorCode.INVALID_PARTICIPANT_NAME_FORMAT.getCode()
                );
            }
            if (p.getGender() == null) {
<<<<<<< HEAD
                throw new BookingException("Giới tính không được để trống", HttpStatus.BAD_REQUEST, "BOOKING_026");
            }
            if (p.getAgeType() == null) {
                throw new BookingException("Loại tuổi không được để trống", HttpStatus.BAD_REQUEST, "BOOKING_027");
            }
            if (!fullNames.add(p.getFullName().toLowerCase())) {
                throw new BookingException("Người tham gia trùng lặp: " + p.getFullName(), HttpStatus.BAD_REQUEST, "BOOKING_020");
=======
                throw new BookingException(
                        BookingErrorCode.MISSING_GENDER.getMessage(),
                        HttpStatus.BAD_REQUEST,
                        BookingErrorCode.MISSING_GENDER.getCode()
                );
            }
            if (p.getAgeType() == null) {
                throw new BookingException(
                        BookingErrorCode.MISSING_AGE_TYPE.getMessage(),
                        HttpStatus.BAD_REQUEST,
                        BookingErrorCode.MISSING_AGE_TYPE.getCode()
                );
            }
            if (!fullNames.add(p.getFullName().toLowerCase())) {
                throw new BookingException(
                        BookingErrorCode.DUPLICATE_PARTICIPANT.getMessage() + ": " + p.getFullName(),
                        HttpStatus.BAD_REQUEST,
                        BookingErrorCode.DUPLICATE_PARTICIPANT.getCode()
                );
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
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
                .paymentMethodId(request.getPaymentMethodId())
                .build();

        List<Participant> participants = request.getParticipants().stream()
                .map(p -> buildParticipant(p, booking))
                .toList();
        booking.getParticipants().addAll(participants);
        booking.calculateTotalPrice(tour.getPrice());
        return booking;
    }

    private String generateBookingCode(UserDTO user, LightTourDTO tour) {
<<<<<<< HEAD
=======
        if (user == null || tour == null) {
            throw new BookingException(
                    "User and tour information are required for booking code generation",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_027"
            );
        }
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
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
        if (request == null || booking == null) {
            throw new BookingException(
                    BookingErrorCode.INVALID_PARTICIPANT.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.INVALID_PARTICIPANT.getCode()
            );
        }
        return Participant.builder()
                .fullName(request.getFullName())
                .gender(request.getGender())
                .ageType(request.getAgeType())
                .booking(booking)
                .build();
    }

<<<<<<< HEAD
    private void updateTourParticipants(LightTourDTO tour, int additionalParticipants) {
        if (tour.getTourId() == null) {
            logger.error("Tour ID is null for tour code: {}", tour.getTourCode());
            throw new BookingException("Tour ID không được null", HttpStatus.BAD_REQUEST, "BOOKING_014");
=======
    private void updateTourParticipants(LightTourDTO tour, int participantChange, boolean isAdding) {
        if (tour == null || tour.getTourId() == null) {
            throw new BookingException(
                    BookingErrorCode.INVALID_TOUR_ID.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.INVALID_TOUR_ID.getCode()
            );
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
        }

        int currentParticipants = tour.getCurrentParticipants() != null ? tour.getCurrentParticipants() : 0;
        int newParticipants = isAdding ? currentParticipants + participantChange : participantChange;

        if (newParticipants < 0 || newParticipants > tour.getMaxParticipants()) {
            throw new BookingException(
                    isAdding ? BookingErrorCode.INSUFFICIENT_SEATS.getMessage() :
                            BookingErrorCode.INVALID_PARTICIPANT_COUNT.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    isAdding ? BookingErrorCode.INSUFFICIENT_SEATS.getCode() :
                            BookingErrorCode.INVALID_PARTICIPANT_COUNT.getCode()
            );
        }

        try {
            Map<String, Integer> requestBody = Map.of("currentParticipants", newParticipants);
            catalogClient.updateCurrentParticipants(tour.getTourId(), requestBody);
            tour.setCurrentParticipants(newParticipants);
            logger.info("Updated tour {} with new participant count: {}", tour.getTourCode(), newParticipants);
        } catch (Exception e) {
            logger.error("Failed to update tour participants for tour {}: {}", tour.getTourCode(), e.getMessage(), e);
            throw new BookingException(
                    BookingErrorCode.UPDATE_PARTICIPANTS_FAILED.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    BookingErrorCode.UPDATE_PARTICIPANTS_FAILED.getCode()
            );
        }
    }

    private void validateStatusTransition(BookingStatus currentStatus, BookingStatus newStatus) {
        if (currentStatus == null || newStatus == null) {
            throw new BookingException(
                    "Current and new status are required",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_028"
            );
        }
        if (currentStatus == BookingStatus.COMPLETED) {
            throw new BookingException(
                    BookingErrorCode.COMPLETED_STATUS_TRANSITION.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.COMPLETED_STATUS_TRANSITION.getCode()
            );
        }
        if (newStatus == BookingStatus.COMPLETED) {
            throw new BookingException(
                    "Cannot manually transition to COMPLETED",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_029"
            );
        }
        if (currentStatus == BookingStatus.CANCELLED && newStatus != BookingStatus.CANCELLED) {
            throw new BookingException(
                    BookingErrorCode.CANCELLED_STATUS_TRANSITION.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.CANCELLED_STATUS_TRANSITION.getCode()
            );
        }
    }

<<<<<<< HEAD
    private BookingResponseDTO convertToResponseDTO(Booking booking, LightTourDTO tour, UserDTO user) {
=======
    private void validateCancelRequest(Booking booking, CancelReason reason) {
        if (booking == null) {
            throw new BookingException(
                    BookingErrorCode.NOT_FOUND.getMessage(),
                    HttpStatus.NOT_FOUND,
                    BookingErrorCode.NOT_FOUND.getCode()
            );
        }
        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new BookingException(
                    "Booking is already cancelled",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_030"
            );
        }
        if (booking.getBookingStatus() == BookingStatus.COMPLETED) {
            throw new BookingException(
                    BookingErrorCode.COMPLETED_BOOKING_CANCEL.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.COMPLETED_BOOKING_CANCEL.getCode()
            );
        }
        if (booking.getBookingStatus() == BookingStatus.CONFIRMED && reason == null) {
            throw new BookingException(
                    BookingErrorCode.MISSING_CANCEL_REASON.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.MISSING_CANCEL_REASON.getCode()
            );
        }
    }

    private int calculateNewParticipantCount(LightTourDTO tour, int participantsToRemove) {
        if (tour == null) {
            throw new BookingException(
                    BookingErrorCode.TOUR_NOT_FOUND.getMessage(),
                    HttpStatus.NOT_FOUND,
                    BookingErrorCode.TOUR_NOT_FOUND.getCode()
            );
        }
        int currentParticipants = tour.getCurrentParticipants() != null ? tour.getCurrentParticipants() : 0;
        int newParticipants = currentParticipants - participantsToRemove;
        if (newParticipants < 0) {
            logger.error("Invalid participant count for tour {}: {}", tour.getTourCode(), newParticipants);
            throw new BookingException(
                    BookingErrorCode.INVALID_PARTICIPANT_COUNT.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    BookingErrorCode.INVALID_PARTICIPANT_COUNT.getCode()
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
        booking.setReason(reason);
        booking.setCanceledBy(canceledBy);

        try {
            sendBookingCancellationNotificationAsync(booking, fetchUser(booking.getUserId()), tour,
                    reason != null ? reason.getDescription() : "No specific reason");
        } catch (Exception e) {
            logger.error("Failed to send cancellation notification for booking {}: {}",
                    booking.getBookingCode(), e.getMessage(), e);
        }
    }

    private BookingResponseDTO convertToResponseDTO(Booking booking, LightTourDTO tour, UserDTO user) {
        if (booking == null || tour == null || user == null) {
            throw new BookingException(
                    "Booking, tour, and user information are required",
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    BookingErrorCode.INTERNAL_ERROR.getCode()
            );
        }
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
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
        dto.setReason(booking.getReason());
        dto.setCanceledBy(booking.getCanceledBy());
        dto.setPaymentMethodId(booking.getPaymentMethodId());

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
<<<<<<< HEAD
=======
        if (lightTour == null) {
            throw new BookingException(
                    BookingErrorCode.TOUR_NOT_FOUND.getMessage(),
                    HttpStatus.NOT_FOUND,
                    BookingErrorCode.TOUR_NOT_FOUND.getCode()
            );
        }
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
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

<<<<<<< HEAD
    @Async
    public void sendBookingConfirmationAsync(Booking booking, UserDTO user, LightTourDTO tour) {
        emailService.sendBookingConfirmation(booking, user, convertToTourDTO(tour));
    }
}
=======
    private void broadcastBookingEvent(String topic, BookingResponseDTO response, String bookingCode) {
        try {
            messagingTemplate.convertAndSend(topic, response);
            logger.info("Broadcasted event to {} for booking: {}", topic, bookingCode);
        } catch (Exception e) {
            logger.error("Failed to send WebSocket message to {} for booking {}: {}",
                    topic, bookingCode, e.getMessage(), e);
        }
    }

    @Async
    public void sendBookingConfirmationAsync(Booking booking, UserDTO user, LightTourDTO tour) {
        try {
            emailService.sendBookingConfirmation(booking, user, convertToTourDTO(tour));
            logger.info("Sent booking confirmation email for booking: {}", booking.getBookingCode());
        } catch (Exception e) {
            logger.error("Failed to send booking confirmation email for booking {}: {}",
                    booking.getBookingCode(), e.getMessage(), e);
        }
    }

    @Async
    public void sendBookingCancellationNotificationAsync(Booking booking, UserDTO user, LightTourDTO tour, String reason) {
        try {
            emailService.sendBookingCancellationNotification(booking, user, convertToTourDTO(tour), reason);
            logger.info("Sent cancellation notification for booking: {}", booking.getBookingCode());
        } catch (Exception e) {
            logger.error("Failed to send cancellation notification for booking {}: {}",
                    booking.getBookingCode(), e.getMessage(), e);
        }
    }

    @Async
    public void sendPaymentConfirmationAsync(Booking booking, UserDTO user, LightTourDTO tour) {
        try {
            emailService.sendPaymentConfirmation(booking, booking.getBookingCode());
            logger.info("Sent payment confirmation email for booking: {}", booking.getBookingCode());
        } catch (Exception e) {
            logger.error("Failed to send payment confirmation email for booking {}: {}",
                    booking.getBookingCode(), e.getMessage(), e);
        }
    }
}
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
