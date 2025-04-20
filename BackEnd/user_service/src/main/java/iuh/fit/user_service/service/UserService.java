package iuh.fit.user_service.service;

import iuh.fit.user_service.model.User;

import java.util.List;

public interface UserService {
    User findByUsername(String username);
    User findById(Long id);

    void addFavouriteTour(Long userId, Long tourId);

    void removeFavouriteTour(Long userId, Long tourId);
}
