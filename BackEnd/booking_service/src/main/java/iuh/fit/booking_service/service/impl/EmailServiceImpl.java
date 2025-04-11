package iuh.fit.booking_service.service.impl;

import iuh.fit.booking_service.client.user.UserClient;
import iuh.fit.booking_service.dto.UserDTO;
import iuh.fit.booking_service.entity.Booking;
import iuh.fit.booking_service.service.EmailService;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.format.DateTimeFormatter;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final UserClient userClient;

    public EmailServiceImpl(JavaMailSender mailSender, TemplateEngine templateEngine, UserClient userClient) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.userClient = userClient;
    }

    @Override
    public void sendBookingConfirmation(Booking booking) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Set email details
            UserDTO user = userClient.getUserById(booking.getUserId());
            helper.setTo(user.getEmail());
            helper.setSubject("Xác nhận đặt tour #" + booking.getId());

            // Prepare Thymeleaf context
            Context context = new Context();
            context.setVariable("booking", booking);
            context.setVariable("bookingDate", booking.getBookingDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
            context.setVariable("paymentDueTime", booking.getPaymentDueTime() != null ?
                    booking.getPaymentDueTime().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) : "N/A");

            // Process HTML template
            String htmlContent = templateEngine.process("email/booking-confirmation", context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send booking confirmation email", e);
        }
    }

    @Override
    public void sendPaymentConfirmation(Booking booking, String qrCodeData) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Set email details
            UserDTO user = userClient.getUserById(booking.getUserId());
            helper.setTo(user.getEmail());
            helper.setSubject("Xác nhận thanh toán tour #" + booking.getId());

            // Prepare Thymeleaf context
            Context context = new Context();
            context.setVariable("booking", booking);
            context.setVariable("qrCodeData", qrCodeData);
            context.setVariable("bookingDate", booking.getBookingDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));

            // Process HTML template
            String htmlContent = templateEngine.process("email/payment-confirmation", context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send payment confirmation email", e);
        }
    }
}