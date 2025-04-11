package iuh.fit.se.user_service.controller;

import iuh.fit.se.user_service.config.JwtUtil;
import iuh.fit.se.user_service.dto.LoginRequest;
import iuh.fit.se.user_service.dto.RegisterRequest;
import iuh.fit.se.user_service.dto.TokenResponse;
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
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        TokenResponse tokenResponse = authService.login(loginRequest);
        addTokenCookies(response, tokenResponse);
        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<TokenResponse> register(@Valid @RequestBody RegisterRequest registerRequest, HttpServletResponse response) {
        TokenResponse tokenResponse = authService.register(registerRequest);
        addTokenCookies(response, tokenResponse);
        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<TokenResponse> refreshAccessToken(@RequestBody String refreshToken, HttpServletResponse response) {
        TokenResponse tokenResponse = authService.refreshAccessToken(refreshToken);
        addTokenCookies(response, tokenResponse);
        return ResponseEntity.ok(tokenResponse);
    }

    private void addTokenCookies(HttpServletResponse response, TokenResponse tokenResponse) {
        Cookie accessTokenCookie = new Cookie("accessToken", tokenResponse.getAccessToken());
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setSecure(true);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(24 * 60 * 60);
        accessTokenCookie.setAttribute("SameSite", "Strict");

        Cookie refreshTokenCookie = new Cookie("refreshToken", tokenResponse.getRefreshToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60);
        refreshTokenCookie.setAttribute("SameSite", "Strict");

        response.addCookie(accessTokenCookie);
        response.addCookie(refreshTokenCookie);
    }
}
