package iuh.fit.user_service.service;

import iuh.fit.user_service.dto.*;
import iuh.fit.user_service.model.User;
import org.springframework.security.core.userdetails.UserDetails;

public interface AuthService {
    public AuthResponse login(LoginRequest loginRequest);
//    public void register(RegisterRequest registerRequest);
    public UserDetails verifyToken(String token);
    public AuthResponse refreshToken(String refreshToken);
    AuthResponse verifyOtp(String email, String otp);
    public void requestOtp(RegisterRequest request);
    public void forgotPassword(String email);
    public void resetPassword(ResetPasswordRequest request);
    public void changePassword(String usernameOrEmail, ChangePasswordRequest request);
}
