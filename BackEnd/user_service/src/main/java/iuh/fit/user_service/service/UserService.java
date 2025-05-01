package iuh.fit.user_service.service;

import iuh.fit.user_service.dto.UserDTO;
import iuh.fit.user_service.model.User;

import java.util.List;

public interface UserService {
    User findByUsername(String username);
    User findById(Long id);

    void addFavouriteTour(Long userId, Long tourId);

    // update user information
    User updateUserProfile(Long id, String fullName, String address, String dateOfBirth, String gender, String avatarUrl);

    void removeFavouriteTour(Long userId, Long tourId);

    // User DTO
    UserDTO getUserById(Long id);

    String getUserRoleById(Long id);
}
