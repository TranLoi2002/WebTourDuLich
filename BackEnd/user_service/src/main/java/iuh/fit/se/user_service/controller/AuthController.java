package iuh.fit.se.user_service.controller;

import iuh.fit.se.user_service.config.JwtUtil;
import iuh.fit.se.user_service.dto.LoginRequest;
import iuh.fit.se.user_service.dto.RegisterRequest;
import iuh.fit.se.user_service.model.Role;
import iuh.fit.se.user_service.model.User;
import iuh.fit.se.user_service.repository.RoleRepository;
import iuh.fit.se.user_service.repository.UserRepository;
import iuh.fit.se.user_service.service.AuthService;
import iuh.fit.se.user_service.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        String token = authService.login(loginRequest);
        // Tạo cookie chứa token
        Cookie jwtCookie = new Cookie("jwtToken", token);
        jwtCookie.setHttpOnly(true); // Cookie chỉ có thể được truy cập bởi server, không thể truy cập qua JavaScript
        jwtCookie.setSecure(true); // Chỉ gửi cookie qua HTTPS (bỏ qua nếu đang test local với HTTP)
        jwtCookie.setPath("/"); // Cookie có hiệu lực trên toàn bộ domain
        jwtCookie.setMaxAge(24 * 60 * 60); // Thời gian sống của cookie: 24 giờ
        jwtCookie.setAttribute("SameSite", "Strict"); // Bảo vệ chống CSRF

        // Thêm cookie vào response
        response.addCookie(jwtCookie);

        // Trả về thông báo thành công (không cần trả token trong body nữa)
        return ResponseEntity.ok("Đăng nhập thành công");
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest registerRequest, HttpServletResponse response) {
        String token = authService.register(registerRequest);
        // Tạo cookie chứa token
        Cookie jwtCookie = new Cookie("jwtToken", token);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(24 * 60 * 60);
        jwtCookie.setAttribute("SameSite", "Strict");

        // Thêm cookie vào response
        response.addCookie(jwtCookie);

        // Trả về thông báo thành công
        return ResponseEntity.ok("Đăng ký thành công");
    }
}
