package iuh.fit.se.nhom2_webtourdulich_user_service.service.impl;

import iuh.fit.se.nhom2_webtourdulich_user_service.dto.LoginRequest;
import iuh.fit.se.nhom2_webtourdulich_user_service.dto.RegisterRequest;
import iuh.fit.se.nhom2_webtourdulich_user_service.model.User;
import iuh.fit.se.nhom2_webtourdulich_user_service.repository.UserRepository;
import iuh.fit.se.nhom2_webtourdulich_user_service.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public String login(LoginRequest loginRequest) {
        return "";
    }

    @Override
    public Object register(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        return userRepository.save(user);
    }
}
