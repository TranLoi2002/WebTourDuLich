package iuh.fit.se.service.impl;

import iuh.fit.se.dto.BookingResponseDTO;
import iuh.fit.se.entity.Booking;
import iuh.fit.se.entity.BookingStatus;
import iuh.fit.se.entity.Participant;
import iuh.fit.se.exception.BookingException;
import iuh.fit.se.exception.InvalidBookingStatusException;
import iuh.fit.se.repository.BookingRepository;
import iuh.fit.se.service.BookingService;
import iuh.fit.se.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final EmailService emailService;
//    private final QRCodeService qrCodeService;

    @Override
    public BookingResponseDTO createBooking(Booking bookingRequest) {
        // Validate input
        if (bookingRequest.getTourId() == null || bookingRequest.getUserId() == null) {
            throw new BookingException("Tour ID and User ID are required",
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_001");
        }

        // kiểm tra user có thể  book hay không
        if (!canUserBookingService(bookingRequest.getTourId(), bookingRequest.getUserId())) {
            throw new BookingException("User already has an active booking for this tour",
                    HttpStatus.CONFLICT,
                    "BOOKING_002");
        }

        // Tạo mới booking thay vì reuse
        Booking bookingToSave = new Booking();

        // Copy các thuộc tính từ request
        bookingToSave.setUserId(bookingRequest.getUserId());
        bookingToSave.setTourId(bookingRequest.getTourId());
        bookingToSave.setCustomerName(bookingRequest.getCustomerName());
        bookingToSave.setCustomerEmail(bookingRequest.getCustomerEmail());
        bookingToSave.setCustomerPhone(bookingRequest.getCustomerPhone());

        // Set các giá trị mặc định
        bookingToSave.setBookingDate(LocalDateTime.now());
        bookingToSave.setUpdatedAt(LocalDateTime.now());
        bookingToSave.setPaymentDueTime(LocalDateTime.now().plusHours(24));
        bookingToSave.setBookingStatus(BookingStatus.PENDING);

        // Xử lý participants
        if (bookingRequest.getParticipants() != null && !bookingRequest.getParticipants().isEmpty()) {
            for (Participant participantRequest : bookingRequest.getParticipants()) {
                Participant participant = new Participant();
                participant.setFullName(participantRequest.getFullName());
                participant.setPhoneNumber(participantRequest.getPhoneNumber());
                participant.setGender(participantRequest.getGender());
                participant.setAgeType(participantRequest.getAgeType());
                participant.setBooking(bookingToSave);
                bookingToSave.getParticipants().add(participant);
            }
        }

        Booking savedBooking = bookingRepository.save(bookingToSave);
        emailService.sendBookingConfirmation(savedBooking);

        return convertToResponseDTO(savedBooking);
    }
    private BookingResponseDTO convertToResponseDTO(Booking booking) {
        BookingResponseDTO responseDTO = new BookingResponseDTO();
        // Map các trường cơ bản
        responseDTO.setId(booking.getId());
        responseDTO.setUserId(booking.getUserId());
        responseDTO.setTourId(booking.getTourId());
        responseDTO.setCustomerName(booking.getCustomerName());
        responseDTO.setCustomerEmail(booking.getCustomerEmail());
        responseDTO.setCustomerPhone(booking.getCustomerPhone());
        responseDTO.setBookingDate(booking.getBookingDate());
        responseDTO.setUpdatedAt(booking.getUpdatedAt());
        responseDTO.setPaymentDueTime(booking.getPaymentDueTime());
        responseDTO.setBookingStatus(booking.getBookingStatus());
        responseDTO.setNotes(booking.getNotes());
        responseDTO.setPaymentDueTimeRelevant(booking.getBookingStatus() == BookingStatus.PENDING);

        // Map participants
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

        responseDTO.setParticipants(participantInfos);
        return responseDTO;
    }

    @Override
    @Transactional(readOnly = true)
    public Booking getBooking(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new BookingException("Booking with id " + id + " not found",
                        HttpStatus.NOT_FOUND,
                        "BOOKING_003"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public BookingResponseDTO updateBookingStatus(Long id, BookingStatus newStatus) {
        Booking booking = getBooking(id);

        // Validate status transition
        if (booking.getBookingStatus() == BookingStatus.CANCELLED && newStatus != BookingStatus.CANCELLED) {
            throw new InvalidBookingStatusException(
                    booking.getBookingStatus(),
                    newStatus);
        }

        booking.setBookingStatus(newStatus);
        booking.setUpdatedAt(LocalDateTime.now());

        // Clear payment due time if paid or cancelled
        if (newStatus != BookingStatus.PENDING) {
            booking.setPaymentDueTime(null);
        }

        Booking updatedBooking = bookingRepository.save(booking);

//        // Send payment confirmation if status changed to PAID
//        if (newStatus == BookingStatus.PAID) {
//            String qrCode = qrCodeService.generateQRCode("BOOKING-" + id);
//            emailService.sendPaymentConfirmation(updatedBooking, qrCode);
//        }

        return convertToResponseDTO(updatedBooking);
    }

    @Override
    public BookingResponseDTO cancelBooking(Long id, String reason) {
        Booking booking = getBooking(id);

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new InvalidBookingStatusException(
                    booking.getBookingStatus(),
                    BookingStatus.CANCELLED
            );
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        booking.setPaymentDueTime(null);
        booking.setNotes(reason);

        Booking cancelledBooking = bookingRepository.save(booking);
        return convertToResponseDTO(cancelledBooking);
    }

    @Override
    public boolean canUserBookingService(Long tourId, Long userId) {
        Booking existingBooking = bookingRepository.findBookingByTourIdAndUserId(tourId, userId);
        return existingBooking == null
                || existingBooking.getBookingStatus() == BookingStatus.CANCELLED;
    }

    @Override
    public List<Booking> getAllBookingByUser(Long userId) {
        return List.of();
    }

//    @Override
//    public List<BookingResponseDTO> getBookingsByUser(Long userId) {
//        return bookingRepository.findByUserId(userId).stream()
//                .map(this::convertToResponseDTO)
//                .collect(Collectors.toList());
//    }
}