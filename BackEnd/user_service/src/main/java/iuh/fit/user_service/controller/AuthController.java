package iuh.fit.user_service.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import iuh.fit.user_service.config.JwtUtil;
import iuh.fit.user_service.dto.*;
import iuh.fit.user_service.model.Role;
import iuh.fit.user_service.model.User;
import iuh.fit.user_service.model.VerificationToken;
import iuh.fit.user_service.repository.RoleRepository;
import iuh.fit.user_service.repository.UserRepository;
import iuh.fit.user_service.repository.VerificationTokenRepository;
import iuh.fit.user_service.service.AuthService;
import iuh.fit.user_service.service.EmailService;
import iuh.fit.user_service.service.UserService;
import iuh.fit.user_service.service.impl.CustomUserDetailsService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthService authService;


    @Autowired
    private UserRepository userRepository;
<<<<<<< HEAD
    @Autowired
    private VerificationTokenRepository verificationTokenRepository;
    @Autowired
    private CustomUserDetailsService customUserDetailsService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

=======

//    @PostMapping("/login")
//    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
//        String token = authService.login(loginRequest);
//        addJwtCookie(response, token);
//        return ResponseEntity.ok("Đăng nhập thành công");
//    }
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        AuthResponse authResponse = authService.login(loginRequest);
        addJwtCookie(response, authResponse.getAccessToken(), "jwtToken");
        addJwtCookie(response, authResponse.getRefreshToken(), "refreshToken");
        return ResponseEntity.ok(authResponse);
    }


    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        Cookie jwtCookie = new Cookie("jwtToken", null);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(true); // Chỉ sử dụng nếu bạn dùng HTTPS
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0); // Xóa cookie

        Cookie refreshCookie = new Cookie("refreshToken", null);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(0);

        response.addCookie(jwtCookie);
        response.addCookie(refreshCookie);

        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/verifyUser")
    public ResponseEntity<?> verifyUser(HttpServletRequest request) {
        String token = extractTokenFromCookies(request, "jwtToken");
        if (token != null) {
            UserDetails userDetails = authService.verifyToken(token);

            // Fetch additional user details from the database
<<<<<<< HEAD
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Email not found"));
=======
            User user = userRepository.findByUserName(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f

            // Return a custom response with user details
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUserName());
<<<<<<< HEAD
            response.put("fullName", user.getFullName());
=======
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
            response.put("email", user.getEmail());
            response.put("role", user.getRole().getRoleName());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body("Token không hợp lệ hoặc không tồn tại");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractTokenFromCookies(request, "refreshToken");
        if (refreshToken != null) {
            try {
                AuthResponse authResponse = authService.refreshToken(refreshToken);
                addJwtCookie(response, authResponse.getAccessToken(), "jwtToken");
                addJwtCookie(response, authResponse.getRefreshToken(), "refreshToken"); // Optional: Update refresh token
                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("accessToken", authResponse.getAccessToken());
                responseBody.put("refreshToken", authResponse.getRefreshToken());
                responseBody.put("message", "Token đã được làm mới");
                return ResponseEntity.ok(responseBody);
            } catch (RuntimeException e) {
                return ResponseEntity.status(401).body("Refresh Token không hợp lệ hoặc đã hết hạn");
            }
        }
        return ResponseEntity.status(401).body("Refresh Token không tồn tại");
    }

    @PostMapping("/request-otp")
    public ResponseEntity<String> requestOtp(@Valid @RequestBody RegisterRequest request) {
        authService.requestOtp(request);
        return ResponseEntity.ok("OTP đã được gửi đến email của bạn");
    }


    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        AuthResponse response = authService.verifyOtp(email, otp);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok("OTP đã được gửi về email của bạn");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@Valid @RequestBody  ChangePasswordRequest request,
                                                 Principal principal) {
        authService.changePassword(principal.getName(), request);
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }


    private void addJwtCookie(HttpServletResponse response, String token, String cookieName) {
        Cookie jwtCookie = new Cookie(cookieName, token);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(24 * 60 * 60);
        jwtCookie.setAttribute("SameSite", "Strict");
        response.addCookie(jwtCookie);
    }

    private void clearCookie(HttpServletResponse response, String cookieName) {
        Cookie cookie = new Cookie(cookieName, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
    }

    private String extractTokenFromCookies(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
