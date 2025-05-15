package iuh.fit.user_service.service;

import iuh.fit.user_service.model.User;
import iuh.fit.user_service.model.VerificationToken;

import java.time.LocalDateTime;
import java.util.List;

public interface EmailService {
    void sendEmail(String to, String subject, String content);
}
