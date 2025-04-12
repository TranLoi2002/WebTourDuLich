package iuh.fit.user_service.service.impl;

import iuh.fit.user_service.config.JwtUtil;
import iuh.fit.user_service.dto.AuthResponse;
import iuh.fit.user_service.dto.LoginRequest;
import iuh.fit.user_service.dto.RegisterRequest;
import iuh.fit.user_service.model.Role;
import iuh.fit.user_service.model.User;
import iuh.fit.user_service.repository.RoleRepository;
import iuh.fit.user_service.repository.UserRepository;
import iuh.fit.user_service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
    private UserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    public AuthServiceImpl(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

//    @Override
//    public String login(LoginRequest loginRequest) {
//        // Kiểm tra logic nghiệp vụ (nếu cần)
//        authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
//        );
//
//        final UserDetails userDetails = customUserDetailsService.loadUserByUsername(loginRequest.getUsername());
//        return jwtUtil.generateToken(userDetails);
//    }


    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        // Xác thực người dùng
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUserName(),
                        loginRequest.getPassWord()
                )
        );

        // Load UserDetails
        final UserDetails userDetails = customUserDetailsService.loadUserByUsername(loginRequest.getUserName());

        // Tạo Access Token và Refresh Token
        String accessToken = jwtUtil.generateToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        // Truy vấn đối tượng User từ database
        User user = userRepository.findByUserName(loginRequest.getUserName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new AuthResponse(accessToken, refreshToken, user);
    }

    @Override
    public AuthResponse register(RegisterRequest registerRequest) {
        // Kiểm tra xem username đã tồn tại chưa
        if (userRepository.findByUserName(registerRequest.getUserName()).isPresent()) {
            throw new IllegalArgumentException("Username đã tồn tại: " + registerRequest.getUserName());
        }

        // Kiểm tra xem role có tồn tại không
        Role role = roleRepository.findByRoleName(registerRequest.getRoleName())
                .orElseThrow(() -> new IllegalArgumentException("Role không tồn tại: " + registerRequest.getRoleName()));

        User user = new User();
        user.setUserName(registerRequest.getUserName());
        user.setPassWord(passwordEncoder.encode(registerRequest.getPassWord()));
        user.setFullName(registerRequest.getFullName());
        user.setEmail(registerRequest.getEmail());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setIsActive(true);
        user.setCreateAt(LocalDateTime.now());
        user.setRole(role);

        userRepository.save(user);

        final UserDetails userDetails = customUserDetailsService.loadUserByUsername(registerRequest.getUserName());

        // Tạo Access Token và Refresh Token
        String accessToken = jwtUtil.generateToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        return new AuthResponse(accessToken, refreshToken,user);
    }

//    @Override
//    public String register(RegisterRequest registerRequest) {
//        // Kiểm tra xem username đã tồn tại chưa
//        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
//            throw new IllegalArgumentException("Username đã tồn tại: " + registerRequest.getUsername());
//        }
//
//        // Kiểm tra xem role có tồn tại không
//        Role role = roleRepository.findByRoleName(registerRequest.getRoleName())
//                .orElseThrow(() -> new IllegalArgumentException("Role không tồn tại: " + registerRequest.getRoleName()));
//
//        User user = new User();
//        user.setUsername(registerRequest.getUsername());
//        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
//        user.setName(registerRequest.getName());
//        user.setEmail(registerRequest.getEmail());
//        user.setPhone(registerRequest.getPhone());
//        user.setIsActive(true);
//        user.setCreateAt(LocalDateTime.now());
//        user.setRole(role);
//
//        userRepository.save(user);
//
//        final UserDetails userDetails = customUserDetailsService.loadUserByUsername(registerRequest.getUsername());
//        return jwtUtil.generateToken(userDetails);
//    }

    @Override
    public UserDetails verifyToken(String token) {
        String username = jwtUtil.extractUsername(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        if (username != null && jwtUtil.validateToken(token, userDetails)) {
            return userDetails;
        }
        throw new RuntimeException("Token không hợp lệ");
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        try {
            // Kiểm tra refresh token có hợp lệ không
            String username = jwtUtil.extractUsername(refreshToken);
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(refreshToken, userDetails)) {
                // Tạo access token mới
                String newAccessToken = jwtUtil.generateToken(userDetails);
                String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);

                return new AuthResponse(newAccessToken, newRefreshToken);
            }
        } catch (Exception e) {
            throw new RuntimeException("Làm mới token thất bại", e);
        }
        throw new RuntimeException("Refresh Token không hợp lệ");
    }
}
