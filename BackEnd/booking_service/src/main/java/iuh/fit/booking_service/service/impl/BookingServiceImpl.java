package iuh.fit.booking_service.service.impl;

import iuh.fit.booking_service.client.catalog.CatalogClient;
import iuh.fit.booking_service.client.user.UserClient;
import iuh.fit.booking_service.dto.BookingResponseDTO;
import iuh.fit.booking_service.dto.LightTourDTO;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingServiceImpl.class);
    private static final String TIMEZONE = "Asia/Ho_Chi_Minh";

    private final BookingRepository bookingRepository;
    private final EmailService emailService;
    private final CatalogClient catalogClient;
    private final UserClient userClient;

    @Override
    @Transactional
    public BookingResponseDTO createBooking(Booking bookingRequest) {
        logger.info("Creating booking for tourId: {}, userId: {}", bookingRequest.getTourId(), bookingRequest.getUserId());
        validateBookingRequest(bookingRequest);

        LightTourDTO tour = fetchTour(bookingRequest.getTourId());
        UserDTO user = fetchUser(bookingRequest.getUserId());
        validateBooking(tour, user, bookingRequest);

        Booking savedBooking = bookingRepository.save(prepareBooking(bookingRequest, user, tour));
        updateTourParticipants(tour, bookingRequest.getParticipants().size());
        sendBookingConfirmationAsync(savedBooking, user, tour);

        logger.info("Booking created successfully with code: {}", savedBooking.getBookingCode());
        return convertToResponseDTO(savedBooking, tour, user);
    }

    @Override
    @Transactional(readOnly = true)
    public Booking getBooking(Long id) {
        logger.info("Fetching booking with id: {}", id);
        return bookingRepository.findByIdWithParticipants(id)
                .orElseThrow(() -> new BookingException("Booking không tồn tại", HttpStatus.NOT_FOUND, "BOOKING_003"));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponseDTO> getAllBookings(Pageable pageable) {
        logger.info("Fetching bookings with page: {}, size: {}", pageable.getPageNumber(), pageable.getPageSize());
        Page<Booking> bookings = bookingRepository.findAll(pageable);
        return bookings.map(booking -> {
            LightTourDTO tour = fetchTour(booking.getTourId());
            UserDTO user = fetchUser(booking.getUserId());
            return convertToResponseDTO(booking, tour, user);
        });
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
        return convertToResponseDTO(updatedBooking, fetchTour(booking.getTourId()), fetchUser(booking.getUserId()));
    }

    @Override
    @Transactional
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
        return convertToResponseDTO(cancelledBooking, fetchTour(booking.getTourId()), fetchUser(booking.getUserId()));
    }

    @Override
    @Transactional(readOnly = true)
    public boolean canUserBookTour(Long tourId, Long userId) {
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

    @Cacheable(value = "tours", key = "#tourId")
    public LightTourDTO fetchTour(Long tourId) {
        logger.info("Fetching tour with id: {}", tourId);
        LightTourDTO tour = catalogClient.getTourById(tourId);
        if (tour == null) {
            throw new BookingException("Tour không tồn tại", HttpStatus.NOT_FOUND, "BOOKING_010");
        }
        return tour;
    }

    @Cacheable(value = "users", key = "#userId")
    public UserDTO fetchUser(Long userId) {
        logger.info("Fetching user with id: {}", userId);
        UserDTO user = userClient.getUserById(userId);
        if (user == null) {
            throw new BookingException("User không tồn tại", HttpStatus.NOT_FOUND, "BOOKING_004");
        }
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
        }
    }

    private void validateTour(LightTourDTO tour) {
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
        if (tour.getStartDate() != null && tour.getStartDate().before(new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000))) {
            throw new BookingException("Phải đặt tour ít nhất 3 ngày trước khi khởi hành",
                    HttpStatus.BAD_REQUEST, "BOOKING_008");
        }
    }

    private void validateParticipants(List<Participant> participants) {
        if (participants == null || participants.isEmpty()) {
            throw new BookingException("Phải có ít nhất 1 người tham gia", HttpStatus.BAD_REQUEST, "BOOKING_009");
        }

        Set<String> fullNames = new HashSet<>();
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
            if (!fullNames.add(p.getFullName().toLowerCase())) {
                throw new BookingException("Người tham gia trùng lặp: " + p.getFullName(), HttpStatus.BAD_REQUEST, "BOOKING_020");
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

    private void updateTourParticipants(LightTourDTO tour, int additionalParticipants) {
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

    @Async
    public void sendBookingConfirmationAsync(Booking booking, UserDTO user, LightTourDTO tour) {
        emailService.sendBookingConfirmation(booking, user, convertToTourDTO(tour));
    }
}