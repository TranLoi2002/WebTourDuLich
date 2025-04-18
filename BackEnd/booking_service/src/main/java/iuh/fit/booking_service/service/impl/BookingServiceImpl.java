package iuh.fit.booking_service.service.impl;

import iuh.fit.booking_service.client.catalog.CatalogClient;
import iuh.fit.booking_service.client.user.UserClient;
import iuh.fit.booking_service.dto.BookingResponseDTO;
import iuh.fit.booking_service.dto.TourDTO;
import iuh.fit.booking_service.dto.UserDTO;
import iuh.fit.booking_service.entity.AgeType;
import iuh.fit.booking_service.entity.Booking;
import iuh.fit.booking_service.entity.BookingStatus;
import iuh.fit.booking_service.entity.Participant;
import iuh.fit.booking_service.exception.BookingException;
import iuh.fit.booking_service.exception.InvalidBookingStatusException;
import iuh.fit.booking_service.repository.BookingRepository;
import iuh.fit.booking_service.service.BookingService;
import iuh.fit.booking_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingServiceImpl implements BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingServiceImpl.class);
    private static final String TIMEZONE = "Asia/Ho_Chi_Minh";

    private final BookingRepository bookingRepository;
    private final EmailService emailService;
    private final CatalogClient catalogClient;
    private final UserClient userClient;

    @Override
    public BookingResponseDTO createBooking(Booking bookingRequest) {
        logger.info("Creating booking for tourId: {}, userId: {}", bookingRequest.getTourId(), bookingRequest.getUserId());
        validateBookingRequest(bookingRequest);

        TourDTO tour = fetchTour(bookingRequest.getTourId());
        UserDTO user = fetchUser(bookingRequest.getUserId());
        validateBooking(tour, user, bookingRequest);

        Booking savedBooking = bookingRepository.save(prepareBooking(bookingRequest, user, tour));
        tour.setTourId(bookingRequest.getTourId());
        updateTourParticipants(tour, bookingRequest.getParticipants().size());
        emailService.sendBookingConfirmation(savedBooking, user, tour);

        logger.info("Booking created successfully with code: {}", savedBooking.getBookingCode());
        return convertToResponseDTO(savedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public Booking getBooking(Long id) {
        logger.info("Fetching booking with id: {}", id);
        return bookingRepository.findById(id)
                .orElseThrow(() -> new BookingException("Booking không tồn tại", HttpStatus.NOT_FOUND, "BOOKING_003"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> getAllBookings() {
        logger.info("Fetching all bookings");
        return bookingRepository.findAll();
    }

    @Override
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
        return convertToResponseDTO(updatedBooking);
    }

    @Override
    public BookingResponseDTO cancelBooking(Long id, String reason) {
        logger.info("Cancelling booking with id: {}, reason: {}", id, reason);
        Booking booking = getBooking(id);
        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new InvalidBookingStatusException(booking.getBookingStatus(), BookingStatus.CANCELLED);
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        booking.setPaymentDueTime(null);
        booking.setNotes(reason);

        Booking cancelledBooking = bookingRepository.save(booking);
        return convertToResponseDTO(cancelledBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean canUserBookingService(Long tourId, Long userId) {
        logger.debug("Checking if user {} can book tour {}", userId, tourId);
        Booking existing = bookingRepository.findBookingByTourIdAndUserId(tourId, userId);
        return existing == null || existing.getBookingStatus() == BookingStatus.CANCELLED;
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

    private void validateBookingRequest(Booking booking) {
        if (booking.getTourId() == null || booking.getUserId() == null) {
            throw new BookingException("Tour ID và User ID là bắt buộc", HttpStatus.BAD_REQUEST, "BOOKING_001");
        }
    }

    private TourDTO fetchTour(Long tourId) {
        logger.info("Fetching tour with id: {}", tourId);
        TourDTO tour = catalogClient.getTourById(tourId);
        if (tour == null) {
            throw new BookingException("Tour không tồn tại", HttpStatus.NOT_FOUND, "BOOKING_010");
        }
        return tour;
    }

    private UserDTO fetchUser(Long userId) {
        logger.info("Fetching user with id: {}", userId);
        UserDTO user = userClient.getUserById(userId);
        if (user == null) {
            throw new BookingException("User không tồn tại", HttpStatus.NOT_FOUND, "BOOKING_004");
        }
        return user;
    }

    private void validateBooking(TourDTO tour, UserDTO user, Booking booking) {
        validateTour(tour);
        validateParticipants(booking.getParticipants());
        if (!canUserBookingService(booking.getTourId(), booking.getUserId())) {
            throw new BookingException("Bạn đã có booking cho tour này rồi", HttpStatus.CONFLICT, "BOOKING_002");
        }

        int totalParticipants = bookingRepository.countTotalParticipantsByTourId(booking.getTourId());
        int remaining = tour.getMaxParticipants() - totalParticipants;
        if (booking.getParticipants().size() > remaining) {
            throw new BookingException("Tour không đủ chỗ. Số chỗ còn lại: " + remaining,
                    HttpStatus.CONFLICT, "BOOKING_005");
        }
    }

    private void validateTour(TourDTO tour) {
        Date now = new Date();
        if (tour.getPrice() <= 0) {
            throw new BookingException("Giá tour không hợp lệ", HttpStatus.BAD_REQUEST, "BOOKING_015");
        }
        if (tour.getMaxParticipants() <= 0) {
            throw new BookingException("Số lượng người tham gia tối đa không hợp lệ", HttpStatus.BAD_REQUEST, "BOOKING_011");
        }
        if (tour.getStartDate() != null && tour.getStartDate().before(now)) {
            throw new BookingException("Tour đã khởi hành", HttpStatus.BAD_REQUEST, "BOOKING_007");
        }
        if (tour.getStartDate().before(new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000))) {
            throw new BookingException("Phải đặt tour ít nhất 3 ngày trước khi khởi hành",
                    HttpStatus.BAD_REQUEST, "BOOKING_008");
        }
    }

    private void validateParticipants(List<Participant> participants) {
        if (participants == null || participants.isEmpty()) {
            throw new BookingException("Phải có ít nhất 1 người tham gia", HttpStatus.BAD_REQUEST, "BOOKING_009");
        }

        Set<String> participantSet = new HashSet<>();
        for (Participant p : participants) {
            if (p.getFullName() == null || p.getFullName().trim().isEmpty()) {
                throw new BookingException("Tên người tham gia không được để trống", HttpStatus.BAD_REQUEST, "BOOKING_012");
            }
            if (p.getFullName().length() < 2) {
                throw new BookingException("Tên người tham gia phải có ít nhất 2 ký tự", HttpStatus.BAD_REQUEST, "BOOKING_017");
            }
            if (!p.getFullName().matches("^[a-zA-Z\\sÀ-ỹ]+$")) {
                throw new BookingException("Tên người tham gia chỉ được chứa chữ cái và khoảng trắng", HttpStatus.BAD_REQUEST, "BOOKING_018");
            }

            if (p.getGender() == null) {
                throw new BookingException("Giới tính không được để trống", HttpStatus.BAD_REQUEST, "BOOKING_026");
            }

            if (p.getAgeType() == null) {
                throw new BookingException("Loại tuổi không được để trống", HttpStatus.BAD_REQUEST, "BOOKING_027");
            }

            String participantKey = p.getFullName() + "|" + p.getGender() + "|" + p.getAgeType();
            if (!participantSet.add(participantKey)) {
                throw new BookingException("Người tham gia trùng lặp: " + p.getFullName(), HttpStatus.BAD_REQUEST, "BOOKING_020");
            }
        }
    }
    private Booking prepareBooking(Booking request, UserDTO user, TourDTO tour) {
        // Tạo bookingCode
        String firstLetter = user.getFullName() != null && !user.getFullName().isEmpty()
                ? user.getFullName().substring(0, 1).toUpperCase()
                : "U";
        String tourCodePrefix = tour.getTourCode() != null && tour.getTourCode().length() >= 4
                ? tour.getTourCode().substring(0, 4)
                : tour.getTourCode() != null ? tour.getTourCode() : "TOUR";
        String randomString = RandomStringUtils.randomAlphanumeric(6).toUpperCase();
        String bookingCode = String.format("BK%s%s%s", firstLetter, tourCodePrefix, randomString);


        while (bookingRepository.existsByBookingCode(bookingCode)) {
            randomString = RandomStringUtils.randomAlphanumeric(6).toUpperCase();
            bookingCode = String.format("BK%s%s%s", firstLetter, tourCodePrefix, randomString);
        }

        Booking booking = Booking.builder()
                .userId(request.getUserId())
                .tourId(request.getTourId())
                .bookingCode(bookingCode)
                .bookingDate(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .paymentDueTime(LocalDateTime.now().plusHours(24))
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

    private Participant buildParticipant(Participant request, Booking booking) {
        return Participant.builder()
                .fullName(request.getFullName())
                .gender(request.getGender())
                .ageType(request.getAgeType())
                .booking(booking)
                .build();
    }

    private void updateTourParticipants(TourDTO tour, int additionalParticipants) {
        if (tour.getTourId() == null) {
            logger.error("Tour ID is null for tour code: {}", tour.getTourCode());
            throw new BookingException("Tour ID không được null", HttpStatus.BAD_REQUEST, "BOOKING_014");
        }

        int newParticipants = tour.getCurrentParticipants() != null
                ? tour.getCurrentParticipants() + additionalParticipants
                : additionalParticipants;

        if (newParticipants < 0 || newParticipants > tour.getMaxParticipants()) {
            logger.error("Invalid participant count for tour {}: {}", tour.getTourCode(), newParticipants);
            throw new BookingException("Số lượng người tham gia không hợp lệ", HttpStatus.BAD_REQUEST, "BOOKING_013");
        }

        catalogClient.updateCurrentParticipants(tour.getTourId(), newParticipants);
        tour.setCurrentParticipants(newParticipants);
        logger.info("Updated tour {} with new participant count: {}", tour.getTourCode(), newParticipants);
    }

    private void validateStatusTransition(BookingStatus currentStatus, BookingStatus newStatus) {
        if (currentStatus == BookingStatus.CANCELLED && newStatus != BookingStatus.CANCELLED) {
            throw new InvalidBookingStatusException(currentStatus, newStatus);
        }
    }

    private BookingResponseDTO convertToResponseDTO(Booking booking) {
        TourDTO tour = fetchTour(booking.getTourId());
        UserDTO user = fetchUser(booking.getUserId());
        tour.setTourId(booking.getTourId());
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setBookingCode(booking.getBookingCode());
        dto.setUser(user);
        dto.setTour(tour);
        dto.setTourCode(tour.getTourCode());
        dto.setBookingDate(booking.getBookingDate());
        dto.setUpdatedAt(booking.getUpdatedAt());
        dto.setPaymentDueTime(booking.getPaymentDueTime());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setBookingStatus(booking.getBookingStatus());
        dto.setNotes(booking.getNotes());
        dto.setPaymentDueTimeRelevant(booking.getBookingStatus() == BookingStatus.PENDING);

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
}