package iuh.fit.user_service.service;

import iuh.fit.user_service.dto.AuthResponse;
import iuh.fit.user_service.dto.LoginRequest;
import iuh.fit.user_service.dto.RegisterRequest;
import iuh.fit.user_service.model.User;
import org.springframework.security.core.userdetails.UserDetails;

public interface AuthService {
    public AuthResponse login(LoginRequest loginRequest);
    public void register(RegisterRequest registerRequest);
    public UserDetails verifyToken(String token);
    public AuthResponse refreshToken(String refreshToken);
}
