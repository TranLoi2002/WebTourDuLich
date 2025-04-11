package iuh.fit.se.user_service.service.impl;

import iuh.fit.se.user_service.config.JwtUtil;
import iuh.fit.se.user_service.dto.LoginRequest;
import iuh.fit.se.user_service.dto.RegisterRequest;
import iuh.fit.se.user_service.dto.TokenResponse;
import iuh.fit.se.user_service.model.User;
import iuh.fit.se.user_service.repository.RoleRepository;
import iuh.fit.se.user_service.repository.UserRepository;
import iuh.fit.se.user_service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.logging.Logger;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = Logger.getLogger(AuthServiceImpl.class.getName());

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

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
    public TokenResponse login(LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
        String accessToken = jwtUtil.generateAccessToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow(() -> new RuntimeException("User not found"));
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        TokenResponse tokenResponse = new TokenResponse();
        tokenResponse.setAccessToken(accessToken);
        tokenResponse.setRefreshToken(refreshToken);

        return tokenResponse;
    }

    @Override
    public TokenResponse register(RegisterRequest registerRequest) {
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(roleRepository.findByRoleName(registerRequest.getRoleName()).orElseThrow(() -> new RuntimeException("Role not found")));
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPhone(registerRequest.getPhone());
        user.setCreateAt(LocalDateTime.now());
        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String accessToken = jwtUtil.generateAccessToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        TokenResponse tokenResponse = new TokenResponse();
        tokenResponse.setAccessToken(accessToken);
        tokenResponse.setRefreshToken(refreshToken);

        return tokenResponse;
    }

    @Override
    public TokenResponse refreshAccessToken(String refreshToken) {
        try {
            logger.info("Refreshing access token using refresh token: " + refreshToken);
            User user = userRepository.findByRefreshToken(refreshToken).orElseThrow(() -> new RuntimeException("Invalid refresh token"));
            if (jwtUtil.validateToken(refreshToken)) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
                String newAccessToken = jwtUtil.generateAccessToken(userDetails);
                String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);
                user.setRefreshToken(newRefreshToken);
                userRepository.save(user);

                TokenResponse tokenResponse = new TokenResponse();
                tokenResponse.setAccessToken(newAccessToken);
                tokenResponse.setRefreshToken(newRefreshToken);
                return tokenResponse;
            } else {
                logger.severe("Invalid refresh token: " + refreshToken);
                throw new RuntimeException("Invalid refresh token");
            }
        } catch (Exception e) {
            logger.severe("Error during token refresh: " + e.getMessage());
            throw new RuntimeException("Token refresh failed", e);
        }
    }
}