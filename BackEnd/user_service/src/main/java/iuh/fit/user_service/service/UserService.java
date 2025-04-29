package iuh.fit.user_service.service;

import iuh.fit.user_service.model.User;

public interface UserService {
    User findByUsername(String username);

    User findById(Long id);

    void addFavouriteTour(Long userId, Long tourId);

    void removeFavouriteTour(Long userId, Long tourId);

    User updateUserProfile(Long id, String fullName, String address, String dateOfBirth, String gender, String avatarUrl);

    User updateUser(Long id, User user);
}