package iuh.fit.se.service.impl;

import iuh.fit.se.exception.UserNotFoundException;
import iuh.fit.se.model.User;
import iuh.fit.se.repository.UserRepository;
import iuh.fit.se.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
    }
}
