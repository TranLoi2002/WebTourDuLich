package iuh.fit.booking_service.repository;

import iuh.fit.booking_service.entity.Booking;
import iuh.fit.booking_service.entity.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    /**
     * Tìm tất cả booking với phân trang.
     * @param pageable Thông tin phân trang (page, size, sort)
     * @return Page chứa danh sách Booking
     */
    Page<Booking> findAll(Pageable pageable);

    /**
     * Tìm booking theo ID, kèm theo danh sách participants.
     * @param id ID của booking
     * @return Optional chứa Booking hoặc rỗng nếu không tìm thấy
     */
    @Query("SELECT b FROM Booking b JOIN FETCH b.participants WHERE b.id = :id")
    Optional<Booking> findByIdWithParticipants(@Param("id") Long id);

    /**
     * Tìm booking theo tourId và userId.
     * @param tourId ID của tour
     * @param userId ID của user
     * @return Booking nếu tồn tại, null nếu không tìm thấy
     */
    Booking findBookingByTourIdAndUserId(Long tourId, Long userId);

    /**
     * Tìm danh sách booking theo userId.
     * @param userId ID của user
     * @return Danh sách Booking
     */
    List<Booking> findBookingByUserId(Long userId);

    /**
     * Tìm danh sách booking theo userId với phân trang.
     * @param userId ID của user
     * @param pageable Thông tin phân trang
     * @return Page chứa danh sách Booking
     */
    Page<Booking> findBookingByUserId(Long userId, Pageable pageable);

    /**
     * Tìm danh sách booking theo trạng thái.
     * @param status Trạng thái booking (PENDING, CONFIRMED, CANCELLED, COMPLETED)
     * @return Danh sách Booking
     */
    List<Booking> findBookingByBookingStatus(BookingStatus status);

    /**
     * Tìm danh sách booking theo trạng thái với phân trang.
     * @param status Trạng thái booking (PENDING, CONFIRMED, CANCELLED, COMPLETED)
     * @param pageable Thông tin phân trang
     * @return Page chứa danh sách Booking
     */
    Page<Booking> findBookingByBookingStatus(BookingStatus status, Pageable pageable);

    /**
     * Kiểm tra xem booking code có tồn tại hay không.
     * @param bookingCode Mã booking
     * @return true nếu tồn tại, false nếu không
     */
    boolean existsByBookingCode(String bookingCode);

    /**
     * Đếm tổng số người tham gia của tour, không tính các booking đã hủy.
     * @param tourId ID của tour
     * @return Số lượng người tham gia
     */
    @Query("SELECT COALESCE(COUNT(p), 0) FROM Booking b JOIN b.participants p " +
            "WHERE b.tourId = :tourId AND b.bookingStatus != 'CANCELLED'")
    int countTotalParticipantsByTourId(@Param("tourId") Long tourId);

    /**
     * Tìm booking theo ngày đặt.
     * @param bookingDate Thời gian đặt booking
     * @return Optional chứa Booking hoặc rỗng nếu không tìm thấy
     */
    Optional<Booking> findBookingByBookingDate(LocalDateTime bookingDate);

    /**
     * Tìm danh sách booking theo trạng thái và thời hạn thanh toán trước thời điểm chỉ định.
     * @param bookingStatus Trạng thái booking
     * @param now Thời điểm hiện tại
     * @return Danh sách Booking
     */
    List<Booking> findByBookingStatusAndPaymentDueTimeBefore(BookingStatus bookingStatus, LocalDateTime now);



}