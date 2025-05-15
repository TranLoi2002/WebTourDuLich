package iuh.fit.user_service.service.impl;

import iuh.fit.user_service.exception.UserNotFoundException;
import iuh.fit.user_service.feign.CatalogFeignClient;
import iuh.fit.user_service.model.Gender;
import iuh.fit.user_service.model.User;
import iuh.fit.user_service.repository.UserRepository;
import iuh.fit.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CatalogFeignClient catalogFeignClient;

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUserName(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
    }

    @Override
    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found with id: " + id))
                ;
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }


    public void addFavouriteTour(Long userId, Long tourId) {
        catalogFeignClient.addFavouriteTour(userId, tourId);
    }

    @Override
    public User updateUserProfile(Long id, String fullName, String address, String dateOfBirth, String gender, String avatarUrl) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (fullName != null) {
            user.setFullName(fullName);
        }
        if (address != null) {
            user.setAddress(address);
        }
        if (dateOfBirth != null) {
            user.setDateOfBirth(Date.valueOf(dateOfBirth));
        }
        if (gender != null) {
            user.setGender(Gender.valueOf(gender.toUpperCase()));
        }
        if (avatarUrl != null) {
            user.setAvatar(avatarUrl);
        }

        user.setUpdateAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Override
    public void removeFavouriteTour(Long userId, Long tourId) {
        catalogFeignClient.removeFavouriteTour(userId, tourId);
    }
    @Override
    public User updateUser(Long id, User updatedUser) {
        User existingUser = findById(id);

        existingUser.setUserName(updatedUser.getUserName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setFullName(updatedUser.getFullName());
        existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
        existingUser.setRole(updatedUser.getRole());
        existingUser.setIsActive(updatedUser.getIsActive());
        existingUser.setGender(updatedUser.getGender());
        existingUser.setUpdateAt(LocalDateTime.now());

        return userRepository.save(existingUser);
    }
}
