package iuh.fit.booking_service.service.impl;

import iuh.fit.booking_service.client.catalog.CatalogClient;
import iuh.fit.booking_service.dto.BookingResponseDTO;
import iuh.fit.booking_service.dto.TourDTO;
import iuh.fit.booking_service.entity.Booking;
import iuh.fit.booking_service.entity.BookingStatus;
import iuh.fit.booking_service.entity.Participant;
import iuh.fit.booking_service.exception.BookingException;
import iuh.fit.booking_service.exception.InvalidBookingStatusException;
import iuh.fit.booking_service.repository.BookingRepository;
import iuh.fit.booking_service.service.BookingService;
import iuh.fit.booking_service.service.EmailService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final EmailService emailService;
    private final CatalogClient catalogClient;

    @Override
    public BookingResponseDTO createBooking(Booking bookingRequest) {
        validateBookingRequest(bookingRequest);
        TourDTO tour = catalogClient.getTourById(bookingRequest.getTourId());
        if(tour==null){
            throw new BookingException("Tour không tồn tại", HttpStatus.NOT_FOUND, "BOOKING_004");
        }
        validateTourForBooking(tour);
        validateParticipants(bookingRequest.getParticipants());
        if (!canUserBookingService(bookingRequest.getTourId(), bookingRequest.getUserId())) {
            throw new BookingException("Bạn đã có booking cho tour này rồi", HttpStatus.CONFLICT, "BOOKING_002");
        }

        int remaining = tour.getMaxParticipants() - bookingRepository.countTotalParticipantsByTourId(bookingRequest.getTourId());
        if (bookingRequest.getParticipants().size() > remaining) {
            throw new BookingException("Tour không đủ chỗ. Số chỗ còn lại: " + remaining,
                    HttpStatus.CONFLICT, "BOOKING_005");
        }

        Booking savedBooking = bookingRepository.save(prepareBookingToSave(bookingRequest));
        // emailService.sendBookingConfirmation(savedBooking);
        return convertToResponseDTO(savedBooking);
    }

    private void validateBookingRequest(Booking booking) {
        if (booking.getTourId() == null || booking.getUserId() == null) {
            throw new BookingException("Tour ID và User ID là bắt buộc", HttpStatus.BAD_REQUEST, "BOOKING_001");
        }
    }

    private void validateTourForBooking(TourDTO tour) {

        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")); // giờ hệ thống hoặc VN
        // Tour không cho phép đặt
        if (!tour.isActivityTour()) {
            throw new BookingException("Tour hiện tại không cho phép đặt", HttpStatus.BAD_REQUEST, "BOOKING_006");
        }

        // Tour đã khởi hành
        if (tour.getStartDate() != null && tour.getStartDate().isBefore(now)) {
            throw new BookingException("Tour đã khởi hành", HttpStatus.BAD_REQUEST, "BOOKING_007");
        }


        if (tour.getStartDate().isBefore(now.plusDays(3))) {
            throw new BookingException("Bạn phải đặt tour ít nhất 3 ngày trước khi khởi hành",
                    HttpStatus.BAD_REQUEST, "BOOKING_007");
        }

    }


    private void validateParticipants(List<Participant> participants) {
        if (participants == null || participants.isEmpty()) {
            throw new BookingException("Phải có ít nhất 1 người tham gia", HttpStatus.BAD_REQUEST, "BOOKING_008");
        }

        for (Participant p : participants) {
            if (p.getFullName() == null || p.getPhoneNumber() == null || p.getAgeType() == null) {
                throw new BookingException("Thông tin người tham gia không đầy đủ", HttpStatus.BAD_REQUEST, "BOOKING_009");
            }
        }
    }

    private Booking prepareBookingToSave(Booking request) {
        Booking booking = new Booking();
        booking.setUserId(request.getUserId());
        booking.setTourId(request.getTourId());
        booking.setBookingDate(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());
        booking.setPaymentDueTime(LocalDateTime.now().plusHours(24));
        booking.setBookingStatus(BookingStatus.PENDING);

        if (request.getParticipants() != null && !request.getParticipants().isEmpty()) {
            List<Participant> participants = request.getParticipants().stream()
                    .map(p -> buildParticipant(p, booking))
                    .collect(Collectors.toList());
            booking.getParticipants().addAll(participants);
        }

        return booking;
    }

    private Participant buildParticipant(Participant request, Booking booking) {
        Participant participant = new Participant();
        participant.setFullName(request.getFullName());
        participant.setPhoneNumber(request.getPhoneNumber());
        participant.setGender(request.getGender());
        participant.setAgeType(request.getAgeType());
        participant.setBooking(booking);
        return participant;
    }

    private BookingResponseDTO convertToResponseDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        TourDTO tour = catalogClient.getTourById(booking.getTourId());

        dto.setId(booking.getId());
        dto.setTour(tour);
        dto.setCustomerName("cant connect user");
        dto.setCustomerEmail("cant connect user");
        dto.setBookingDate(booking.getBookingDate());
        dto.setUpdatedAt(booking.getUpdatedAt());
        dto.setPaymentDueTime(booking.getPaymentDueTime());
        dto.setBookingStatus(booking.getBookingStatus());
        dto.setNotes(booking.getNotes());
        dto.setPaymentDueTimeRelevant(booking.getBookingStatus() == BookingStatus.PENDING);

        List<BookingResponseDTO.ParticipantInfo> participantInfos = booking.getParticipants().stream()
                .map(p -> {
                    BookingResponseDTO.ParticipantInfo info = new BookingResponseDTO.ParticipantInfo();
                    info.setId(p.getId());
                    info.setFullName(p.getFullName());
                    info.setPhoneNumber(p.getPhoneNumber());
                    info.setGender(p.getGender());
                    info.setAgeType(p.getAgeType());
                    return info;
                }).collect(Collectors.toList());

        dto.setParticipants(participantInfos);
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public Booking getBooking(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new BookingException("Booking với ID " + id + " không tồn tại", HttpStatus.NOT_FOUND, "BOOKING_003"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public BookingResponseDTO updateBookingStatus(Long id, BookingStatus newStatus) {
        Booking booking = getBooking(id);

        if (booking.getBookingStatus() == BookingStatus.CANCELLED && newStatus != BookingStatus.CANCELLED) {
            throw new InvalidBookingStatusException(booking.getBookingStatus(), newStatus);
        }

        booking.setBookingStatus(newStatus);
        booking.setUpdatedAt(LocalDateTime.now());
        if (newStatus != BookingStatus.PENDING) {
            booking.setPaymentDueTime(null);
        }

        return convertToResponseDTO(bookingRepository.save(booking));
    }

    @Override
    public BookingResponseDTO cancelBooking(Long id, String reason) {
        Booking booking = getBooking(id);

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new InvalidBookingStatusException(booking.getBookingStatus(), BookingStatus.CANCELLED);
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        booking.setPaymentDueTime(null);
        booking.setNotes(reason);

        return convertToResponseDTO(bookingRepository.save(booking));
    }

    @Override
    public boolean canUserBookingService(Long tourId, Long userId) {
        Booking existing = bookingRepository.findBookingByTourIdAndUserId(tourId, userId);
        return existing == null || existing.getBookingStatus() == BookingStatus.CANCELLED;
    }

    @Override
    public List<Booking> getAllBookingByUser(Long userId) {
        return bookingRepository.findBookingByUserId(userId);
    }
}