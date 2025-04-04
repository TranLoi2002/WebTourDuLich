package iuh.fit.se.user_service.service.impl;

import iuh.fit.se.user_service.config.JwtUtil;
import iuh.fit.se.user_service.dto.LoginRequest;
import iuh.fit.se.user_service.dto.RegisterRequest;
import iuh.fit.se.user_service.model.Role;
import iuh.fit.se.user_service.model.User;
import iuh.fit.se.user_service.repository.RoleRepository;
import iuh.fit.se.user_service.repository.UserRepository;
import iuh.fit.se.user_service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    public String login(LoginRequest loginRequest) {
        // Kiểm tra logic nghiệp vụ (nếu cần)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        final UserDetails userDetails = customUserDetailsService.loadUserByUsername(loginRequest.getUsername());
        return jwtUtil.generateToken(userDetails);
    }

    @Override
    public String register(RegisterRequest registerRequest) {
        // Kiểm tra xem username đã tồn tại chưa
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username đã tồn tại: " + registerRequest.getUsername());
        }

        // Kiểm tra xem role có tồn tại không
        Role role = roleRepository.findByRoleName(registerRequest.getRoleName())
                .orElseThrow(() -> new IllegalArgumentException("Role không tồn tại: " + registerRequest.getRoleName()));

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPhone(registerRequest.getPhone());
        user.setIsActive(true);
        user.setCreateAt(LocalDateTime.now());
        user.setRole(role);

        userRepository.save(user);

        final UserDetails userDetails = customUserDetailsService.loadUserByUsername(registerRequest.getUsername());
        return jwtUtil.generateToken(userDetails);
    }
}
