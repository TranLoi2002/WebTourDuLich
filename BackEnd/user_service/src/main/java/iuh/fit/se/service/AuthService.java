package iuh.fit.se.service;

import iuh.fit.se.dto.AuthResponse;
import iuh.fit.se.dto.LoginRequest;
import iuh.fit.se.dto.RegisterRequest;
import iuh.fit.se.model.User;
import org.springframework.security.core.userdetails.UserDetails;

public interface AuthService {
    public AuthResponse login(LoginRequest loginRequest);
    public AuthResponse register(RegisterRequest registerRequest);
    public UserDetails verifyToken(String token);
    public AuthResponse refreshToken(String refreshToken);
}
