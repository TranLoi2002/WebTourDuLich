package iuh.fit.se.service.impl;

import iuh.fit.se.dto.BookingDTO;
import iuh.fit.se.entity.Booking;
import iuh.fit.se.entity.BookingStatus;
import iuh.fit.se.exception.BookingNotFoundException;
import iuh.fit.se.exception.InvalidBookingStatusException;
import iuh.fit.se.repository.BookingRepository;
import iuh.fit.se.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;

    @Override
    public Booking createBooking(BookingDTO request) {
        Booking booking = Booking.builder()
                .userId(request.getUserId())  // Set userId từ DTO
                .tourId(request.getTourId())
                .participants(request.getParticipants().stream()
                        .map(p -> p.getFullName() + "_" + p.getPhoneNumber() + "")
                        .toList())
                .customerName("get from UserService") // Sẽ cập nhật sau
                .customerEmail("get from UserService")
                .customerPhone("get from UserService")
                .bookingDate(LocalDateTime.now())
                .bookingStatus(BookingStatus.PENDING)
                .build();

        return bookingRepository.save(booking);
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

}