package iuh.fit.user_service.service;

import iuh.fit.user_service.model.User;

public interface EmailService {
    void sendEmail(String to, String subject, String content);
}
