package iuh.fit.se.nhom2_webtourdulich_user_service.controller;

import iuh.fit.se.nhom2_webtourdulich_user_service.config.JwtUtil;
import iuh.fit.se.nhom2_webtourdulich_user_service.dto.LoginRequest;
import iuh.fit.se.nhom2_webtourdulich_user_service.dto.RegisterRequest;
import iuh.fit.se.nhom2_webtourdulich_user_service.model.Role;
import iuh.fit.se.nhom2_webtourdulich_user_service.model.User;
import iuh.fit.se.nhom2_webtourdulich_user_service.repository.RoleRepository;
import iuh.fit.se.nhom2_webtourdulich_user_service.repository.UserRepository;
import iuh.fit.se.nhom2_webtourdulich_user_service.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;


    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserDetailsService userDetailsService;

    public AuthController(UserService userService, RoleRepository roleRepository, PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.userService = userService;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<java.util.Map<String, String>> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtUtil.generateToken(userDetails.getUsername());

        // Set token vào cookie
        Cookie jwtCookie = new Cookie("JWT_TOKEN", token);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setMaxAge(10 * 60 * 60); // 10 giờ
        jwtCookie.setPath("/");
        response.addCookie(jwtCookie);

        // Trả về token để debug
        Map<String, String> result = new HashMap<>();
        result.put("token", token);
        return ResponseEntity.ok(result);
    }
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        Optional<Role> role = roleRepository.findById(request.getRoleId());
        if (role.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid Role ID");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setRole(role.get());  // Đảm bảo gán Role hợp lệ

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        Cookie jwtCookie = new Cookie("JWT_TOKEN", "");
        jwtCookie.setHttpOnly(true);
        jwtCookie.setMaxAge(0); // Xóa cookie
        jwtCookie.setPath("/");
        response.addCookie(jwtCookie);
        return ResponseEntity.ok("Logged out successfully");
    }
}
