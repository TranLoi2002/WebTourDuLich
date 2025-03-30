package iuh.fit.se.service.impl;
import iuh.fit.se.dto.BookingResponseDTO;
import iuh.fit.se.entity.Booking;
import iuh.fit.se.entity.BookingStatus;
import iuh.fit.se.entity.Participant;
import iuh.fit.se.exception.BookingException;
import iuh.fit.se.exception.BookingNotFoundException;
import iuh.fit.se.exception.InvalidBookingStatusException;
import iuh.fit.se.repository.BookingRepository;
import iuh.fit.se.service.BookingService;
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

    @Override
    public BookingResponseDTO createBooking(Booking bookingRequest) {
        if (!canUserBookingService(bookingRequest.getTourId(), bookingRequest.getUserId())) {
            throw new BookingException("User already has an active booking for this tour",
                    HttpStatus.CONFLICT,
                    "BOOKING_003");
        }
        Booking existingCancelled = bookingRepository.findBookingByTourIdAndUserId(
                bookingRequest.getTourId(),
                bookingRequest.getUserId()
        );

        Booking bookingToSave = existingCancelled != null ? existingCancelled : bookingRequest;
        bookingToSave.setBookingDate(LocalDateTime.now());
        bookingToSave.setBookingStatus(BookingStatus.PENDING);
        if (bookingRequest.getParticipants() != null) {
            for (Participant participant : bookingRequest.getParticipants()) {
                participant.setBooking(bookingRequest);
            }
        }
        Booking savedBooking = bookingRepository.save(bookingToSave);
        return convertToResponseDTO(savedBooking);
    }
    private BookingResponseDTO convertToResponseDTO(Booking booking) {
        BookingResponseDTO responseDTO = new BookingResponseDTO();
        responseDTO.setId(booking.getId());
        responseDTO.setUserId(booking.getUserId());
        responseDTO.setTourId(booking.getTourId());
        responseDTO.setBookingDate(booking.getBookingDate());
        responseDTO.setBookingStatus(booking.getBookingStatus());

        List<BookingResponseDTO.ParticipantInfo> participantInfos = booking.getParticipants().stream()
                .map(participant -> {
                    BookingResponseDTO.ParticipantInfo info = new BookingResponseDTO.ParticipantInfo();
                    info.setId(participant.getId());
                    info.setFullName(participant.getFullName());
                    info.setPhoneNumber(participant.getPhoneNumber());
                    info.setGender(participant.getGender());
                    info.setAgeType(participant.getAgeType());
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
                .orElseThrow(() -> new BookingNotFoundException(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public Booking updateBookingStatus(Long id, BookingStatus newStatus) {
        Booking booking = getBooking(id);
        booking.setBookingStatus(newStatus);
        return bookingRepository.save(booking);
    }

    @Override
    public void cancelBooking(Long id, String reason) {
        Booking booking = getBooking(id);

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new InvalidBookingStatusException(
                    booking.getBookingStatus(),
                    BookingStatus.CANCELLED
            );
        }
        booking.setBookingStatus(BookingStatus.CANCELLED);
//        booking.setCancellationReason(reason);
        bookingRepository.save(booking);
    }
    @Override
    public boolean canUserBookingService(Long serviceId, Long userId) {
        Booking existingBooking = bookingRepository.findBookingByTourIdAndUserId(serviceId, userId);
        return existingBooking == null
                || existingBooking.getBookingStatus() == BookingStatus.CANCELLED;
    }


}