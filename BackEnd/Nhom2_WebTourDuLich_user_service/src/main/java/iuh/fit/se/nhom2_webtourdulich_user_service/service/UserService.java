package iuh.fit.se.nhom2_webtourdulich_user_service.service;

import iuh.fit.se.nhom2_webtourdulich_user_service.dto.RegisterRequest;
import iuh.fit.se.nhom2_webtourdulich_user_service.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User registerUser(RegisterRequest request);
    User getUserById(Long id);
    List<User> getAllUsers();
    User updateUser(Long id, User user);
    void deleteUser(Long id);
}
