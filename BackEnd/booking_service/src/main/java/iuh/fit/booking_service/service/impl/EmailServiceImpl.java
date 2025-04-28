package iuh.fit.booking_service.service.impl;

import iuh.fit.booking_service.client.user.UserClient;
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

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final UserClient userClient;

    private String generateQRCode(String bookingCode) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(bookingCode, BarcodeFormat.QR_CODE, 200, 200);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            byte[] qrCodeBytes = pngOutputStream.toByteArray();

            return Base64.getEncoder().encodeToString(qrCodeBytes);
        } catch (WriterException | IOException e) {
            logger.error("Failed to generate QR code for booking code: {}", bookingCode, e);
            return null;
        }
    }

    @Async
    @Override
    public void sendBookingConfirmation(Booking booking, UserDTO user, TourDTO tour) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            logger.error("Cannot send booking confirmation email: User email is null or empty for booking {}", booking.getBookingCode());
            return;
        }

        logger.info("Sending booking confirmation email for booking code: {} to {}", booking.getBookingCode(), user.getEmail());
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(user.getEmail());
            helper.setSubject("Xác nhận đặt tour #" + booking.getBookingCode() + " - " + tour.getTourCode());

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
            logger.info("Booking confirmation email sent successfully for booking code: {}", booking.getBookingCode());
        } catch (MessagingException e) {
            logger.error("Failed to send booking confirmation email for booking code: {}", booking.getBookingCode(), e);
        }
    }

    @Async
    @Override
    public void sendPaymentConfirmation(Booking booking, String qrCodeData) {
        if (booking.getUserId() == null) {
            logger.error("Cannot send payment confirmation email: User ID is null for booking {}", booking.getBookingCode());
            return;
        }

        UserDTO user = fetchUser(booking.getUserId());
        if (user == null || user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            logger.error("Cannot send payment confirmation email: User email is null or empty for booking {}", booking.getBookingCode());
            return;
        }

        String qrCodeBase64 = generateQRCode(qrCodeData);
        if (qrCodeBase64 == null) {
            logger.error("Failed to generate QR code for booking {}", booking.getBookingCode());
            return;
        }

        logger.info("Sending payment confirmation email for booking code: {} to {}", booking.getBookingCode(), user.getEmail());
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(user.getEmail());
            helper.setSubject("Xác nhận thanh toán tour #" + booking.getBookingCode());

            Context context = new Context();
            context.setVariable("booking", booking);
            context.setVariable("user", user);
            context.setVariable("qrCodeBase64", qrCodeBase64);
            context.setVariable("bookingDate", booking.getBookingDate().format(DATE_FORMATTER));

            String htmlContent = templateEngine.process("email/payment-confirmation", context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Payment confirmation email sent successfully for booking code: {}", booking.getBookingCode());
        } catch (MessagingException e) {
            logger.error("Failed to send payment confirmation email for booking code: {}", booking.getBookingCode(), e);
        }
    }

    @Async
    @Override
    public void sendBookingCancellationNotification(Booking booking, UserDTO user, TourDTO tour, String reason) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            logger.error("Cannot send cancellation email: User email is null or empty for booking {}", booking.getBookingCode());
            return;
        }

        logger.info("Sending booking cancellation email for booking code: {} to {}", booking.getBookingCode(), user.getEmail());
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(user.getEmail());
            helper.setSubject("Thông báo hủy booking #" + booking.getBookingCode() + " - " + tour.getTourCode());

            Context context = new Context();
            context.setVariable("booking", booking);
            context.setVariable("user", user);
            context.setVariable("tour", tour);
            context.setVariable("reason", reason);
            context.setVariable("cancellationDate", booking.getUpdatedAt().format(DATE_FORMATTER));
            context.setVariable("canceledBy", booking.getCanceledBy() != null ? booking.getCanceledBy().toString() : "N/A");

            String htmlContent = templateEngine.process("email/booking-cancellation", context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Booking cancellation email sent successfully for booking code: {}", booking.getBookingCode());
        } catch (MessagingException e) {
            logger.error("Failed to send booking cancellation email for booking code: {}", booking.getBookingCode(), e);
        }
    }

    private UserDTO fetchUser(Long userId) {
        UserDTO user = userClient.getUserById(userId);
        if (user == null) {
            logger.error("User not found for userId: {}", userId);
        }
        return user;
    }
}