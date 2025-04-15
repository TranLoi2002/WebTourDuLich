package iuh.fit.booking_service.service.impl;

import iuh.fit.booking_service.dto.TourDTO;
import iuh.fit.booking_service.dto.UserDTO;
import iuh.fit.booking_service.entity.Booking;
import iuh.fit.booking_service.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Async
    @Override
    public void sendBookingConfirmation(Booking booking, UserDTO user, TourDTO tour) {
        logger.info("Sending booking confirmation email for booking id: {} to {}", booking.getId(), user.getEmail());
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(user.getEmail());
            helper.setSubject("Xác nhận đặt tour #" + booking.getId() + " - " + tour.getTourCode());

            Context context = new Context();
            context.setVariable("booking", booking);
            context.setVariable("user", user);
            context.setVariable("tour", tour);
            context.setVariable("bookingDate", booking.getBookingDate().format(DATE_FORMATTER));
            context.setVariable("paymentDueTime", booking.getPaymentDueTime() != null
                    ? booking.getPaymentDueTime().format(DATE_FORMATTER) : "N/A");
            context.setVariable("participants", booking.getParticipants());

            String htmlContent = templateEngine.process("email/booking-confirmation", context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Booking confirmation email sent successfully for booking id: {}", booking.getId());
        } catch (MessagingException e) {
            logger.error("Failed to send booking confirmation email for booking id: {}", booking.getId(), e);
        }
    }



    @Async
    @Override
    public void sendPaymentConfirmation(Booking booking, String qrCodeData) {
        logger.info("Sending payment confirmation email for booking id: {}", booking.getId());
        // Tương tự, cập nhật để sử dụng UserDTO nếu cần
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo("placeholder@example.com"); // Cần lấy email từ UserDTO
            helper.setSubject("Xác nhận thanh toán tour #" + booking.getId());

            Context context = new Context();
            context.setVariable("booking", booking);
            context.setVariable("qrCodeData", qrCodeData);
            context.setVariable("bookingDate", booking.getBookingDate().format(DATE_FORMATTER));

            String htmlContent = templateEngine.process("email/payment-confirmation", context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Payment confirmation email sent successfully for booking id: {}", booking.getId());
        } catch (MessagingException e) {
            logger.error("Failed to send payment confirmation email for booking id: {}", booking.getId(), e);
        }
    }
}