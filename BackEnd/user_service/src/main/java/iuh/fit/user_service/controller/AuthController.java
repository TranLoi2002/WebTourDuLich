package iuh.fit.user_service.controller;

import iuh.fit.user_service.config.JwtUtil;
import iuh.fit.user_service.dto.AuthResponse;
import iuh.fit.user_service.dto.LoginRequest;
import iuh.fit.user_service.dto.RegisterRequest;
import iuh.fit.user_service.model.Role;
import iuh.fit.user_service.model.User;
import iuh.fit.user_service.model.VerificationToken;
import iuh.fit.user_service.repository.RoleRepository;
import iuh.fit.user_service.repository.UserRepository;
import iuh.fit.user_service.repository.VerificationTokenRepository;
import iuh.fit.user_service.service.AuthService;
import iuh.fit.user_service.service.UserService;
import iuh.fit.user_service.service.impl.CustomUserDetailsService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthService authService;


    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VerificationTokenRepository verificationTokenRepository;
    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        AuthResponse authResponse = authService.login(loginRequest);
        addJwtCookie(response, authResponse.getAccessToken(), "jwtToken");
        addJwtCookie(response, authResponse.getRefreshToken(), "refreshToken");
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest registerRequest) {
        authService.register(registerRequest); // Chỉ tạo user và gửi OTP, chưa tạo token
        return ResponseEntity.ok("Đăng ký thành công! Vui lòng kiểm tra email để xác thực OTP.");
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        clearCookie(response, "jwtToken");
        clearCookie(response, "refreshToken");
        return ResponseEntity.ok("Đăng xuất thành công");
    }

    @GetMapping("/verifyUser")
    public ResponseEntity<?> verifyUser(HttpServletRequest request) {
        String token = extractTokenFromCookies(request, "jwtToken");
        if (token != null) {
            UserDetails userDetails = authService.verifyToken(token);

            // Fetch additional user details from the database
            User user = userRepository.findByUserName(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Return a custom response with user details
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUserName());
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
            AuthResponse authResponse = authService.refreshToken(refreshToken);
            addJwtCookie(response, authResponse.getAccessToken(), "jwtToken");
            return ResponseEntity.ok("Token đã được làm mới");
        }
        return ResponseEntity.status(401).body("Refresh Token không hợp lệ");
    }

    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token) {
        // Giải mã token để lấy username hoặc userId
        String username;
        try {
            username = jwtUtil.extractUsername(token);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Token không hợp lệ hoặc đã hết hạn");
        }

        // Tìm user trong DB
        Optional<User> optionalUser = userRepository.findByUserName(username);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("Người dùng không tồn tại");
        }

        User user = optionalUser.get();
        user.setIsActive(true);  // kích hoạt tài khoản
        userRepository.save(user);

        return ResponseEntity.ok("Xác thực email thành công! Bạn có thể đăng nhập.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String userName, @RequestParam String otp, HttpServletResponse response) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        VerificationToken token = verificationTokenRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã OTP"));

        if (!token.getOtp().equals(otp)) {
            return ResponseEntity.badRequest().body("Sai mã xác thực");
        }

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Mã xác thực đã hết hạn");
        }

        user.setIsActive(true);
        userRepository.save(user);
        verificationTokenRepository.delete(token);

        // Tạo token sau khi xác thực thành công
        final UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getUserName());
        String accessToken = jwtUtil.generateToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        addJwtCookie(response, accessToken, "jwtToken");
        addJwtCookie(response, refreshToken, "refreshToken");

        return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken, user));
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
