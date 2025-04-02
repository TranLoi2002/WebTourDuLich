package iuh.fit.se.nhom2_webtourdulich_user_service.service;

import iuh.fit.se.nhom2_webtourdulich_user_service.dto.LoginRequest;
import iuh.fit.se.nhom2_webtourdulich_user_service.dto.RegisterRequest;

public interface AuthService {
    String login(LoginRequest loginRequest);
    Object register(RegisterRequest request);
}
