package iuh.fit.user_service.service.impl;

import iuh.fit.user_service.exception.UserNotFoundException;
import iuh.fit.user_service.feign.CatalogFeignClient;
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
    public void removeFavouriteTour(Long userId, Long tourId) {
        catalogFeignClient.removeFavouriteTour(userId, tourId);
    }
}
