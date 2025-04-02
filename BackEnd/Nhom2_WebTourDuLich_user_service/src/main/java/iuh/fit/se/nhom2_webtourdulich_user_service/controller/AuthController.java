package iuh.fit.se.nhom2_webtourdulich_user_service.controller;

import iuh.fit.se.nhom2_webtourdulich_user_service.dto.LoginRequest;
import iuh.fit.se.nhom2_webtourdulich_user_service.dto.RegisterRequest;
import iuh.fit.se.nhom2_webtourdulich_user_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
