package iuh.fit.booking_service.scheduler;

import iuh.fit.booking_service.entity.Booking;
import iuh.fit.booking_service.entity.BookingStatus;
import iuh.fit.booking_service.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BookingAutoCancelScheduler {

    private final BookingRepository bookingRepository;

    // Chạy mỗi 10 phút
    @Scheduled(fixedRate = 600_000)
    @Transactional
    public void cancelExpiredBookings() {
        LocalDateTime now = LocalDateTime.now();
        List<Booking> expiredBookings = bookingRepository
                .findByBookingStatusAndPaymentDueTimeBefore(BookingStatus.PENDING, now);

        for (Booking booking : expiredBookings) {
            booking.setBookingStatus(BookingStatus.CANCELLED);
            booking.setUpdatedAt(now);
            booking.setPaymentDueTime(null); // Đã hủy thì không cần hạn thanh toán
            log.info("Booking ID {} tự động bị hủy do quá hạn thanh toán", booking.getId());
        }

        bookingRepository.saveAll(expiredBookings);
    }
}
