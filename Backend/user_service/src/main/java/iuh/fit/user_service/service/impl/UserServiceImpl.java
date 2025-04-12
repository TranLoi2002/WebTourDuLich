package iuh.fit.user_service.service.impl;

import iuh.fit.user_service.exception.UserNotFoundException;
import iuh.fit.user_service.model.User;
import iuh.fit.user_service.repository.UserRepository;
import iuh.fit.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUserName(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
    }
}
