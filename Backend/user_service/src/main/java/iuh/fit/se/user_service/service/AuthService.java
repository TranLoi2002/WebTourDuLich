package iuh.fit.se.user_service.service;

import iuh.fit.se.user_service.dto.LoginRequest;
import iuh.fit.se.user_service.dto.RegisterRequest;
import iuh.fit.se.user_service.dto.TokenResponse;
import iuh.fit.se.user_service.model.User;

public interface AuthService {
    TokenResponse login(LoginRequest loginRequest);
    TokenResponse register(RegisterRequest registerRequest);

    TokenResponse refreshAccessToken(String refreshToken);
}
