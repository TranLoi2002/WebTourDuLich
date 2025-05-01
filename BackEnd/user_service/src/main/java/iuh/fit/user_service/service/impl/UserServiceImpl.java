package iuh.fit.user_service.service.impl;

import iuh.fit.user_service.dto.UserDTO;
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
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        return mapToDTO(user);
    }

    private UserDTO mapToDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUserName());
        userDTO.setEmail(user.getEmail());
        userDTO.setFullName(user.getFullName());
        userDTO.setPhone(user.getPhoneNumber());
        userDTO.setAddress(user.getAddress());
        userDTO.setAvatar(user.getAvatar());
        userDTO.setRole(user.getRole().getRoleName());

        return userDTO;
    }

    @Override
    public String getUserRoleById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        return user.getRole().getRoleName();
    }
}
