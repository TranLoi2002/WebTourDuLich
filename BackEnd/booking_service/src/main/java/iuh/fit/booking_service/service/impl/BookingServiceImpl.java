package iuh.fit.booking_service.service.impl;

import iuh.fit.booking_service.dto.BookingResponseDTO;
import iuh.fit.booking_service.dto.UserDTO;
import iuh.fit.booking_service.entity.Booking;
import iuh.fit.booking_service.entity.BookingStatus;
import iuh.fit.booking_service.entity.Participant;
import iuh.fit.booking_service.exception.BookingException;
import iuh.fit.booking_service.exception.InvalidBookingStatusException;
import iuh.fit.booking_service.repository.BookingRepository;
import iuh.fit.booking_service.service.BookingService;
import iuh.fit.booking_service.service.EmailService;
import iuh.fit.booking_service.client.user.UserClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final EmailService emailService;
    private final UserClient userClient;

    @Override
    public BookingResponseDTO createBooking(Booking bookingRequest) {
        if (bookingRequest.getTourId() == null || bookingRequest.getUserId() == null) {
            throw new BookingException("Tour ID and User ID are required",
                    HttpStatus.BAD_REQUEST, "BOOKING_001");
        }

        if (!canUserBookingService(bookingRequest.getTourId(), bookingRequest.getUserId())) {
            throw new BookingException("User already has an active booking for this tour",
                    HttpStatus.CONFLICT, "BOOKING_002");
        }

        Booking bookingToSave = prepareBookingToSave(bookingRequest);
        Booking savedBooking = bookingRepository.save(bookingToSave);

        emailService.sendBookingConfirmation(savedBooking);

        return convertToResponseDTO(savedBooking);
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
        UserDTO user = userClient.getUserById(booking.getUserId());
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUserId());
        dto.setTourId(booking.getTourId());
        dto.setCustomerName(user.getFullName());
        dto.setCustomerEmail(user.getEmail());
        dto.setCustomerPhone(user.getPhoneNumber());
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
                })
                .collect(Collectors.toList());

        dto.setParticipants(participantInfos);
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public Booking getBooking(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new BookingException("Booking with id " + id + " not found",
                        HttpStatus.NOT_FOUND, "BOOKING_003"));
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

        Booking updated = bookingRepository.save(booking);
        return convertToResponseDTO(updated);
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

        Booking cancelled = bookingRepository.save(booking);
        return convertToResponseDTO(cancelled);
    }

    @Override
    public boolean canUserBookingService(Long tourId, Long userId) {
        Booking existing = bookingRepository.findBookingByTourIdAndUserId(tourId, userId);
        return existing == null || existing.getBookingStatus() == BookingStatus.CANCELLED;
    }

    @Override
    public List<Booking> getAllBookingByUser(Long userId) {
        UserDTO user = userClient.getUserById(userId);
        List<Booking> bookings = bookingRepository.findBookingByUserId(userId);

        if (bookings.isEmpty()) {
            throw new BookingException(
                    "No bookings found for user: " + user.getFullName(),
                    HttpStatus.NOT_FOUND,
                    "BOOKING_003"
            );
        }

        return bookings;
    }


}
