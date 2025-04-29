package iuh.fit.user_service.controller;

import iuh.fit.user_service.dto.TourDTO;
import iuh.fit.user_service.feign.CatalogFeignClient;
import iuh.fit.user_service.model.User;
import iuh.fit.user_service.repository.UserRepository;
import iuh.fit.user_service.service.UserService;
import iuh.fit.user_service.service.impl.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final CatalogFeignClient catalogFeignClient;

    @Autowired
    public UserController(
            UserService userService,
            UserRepository userRepository,
            CloudinaryService cloudinaryService,
            CatalogFeignClient catalogFeignClient) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
        this.catalogFeignClient = catalogFeignClient;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{userId}/favourites")
    public ResponseEntity<List<TourDTO>> getUserFavouriteTours(@PathVariable Long userId) {
        List<TourDTO> favouriteTours = catalogFeignClient.getFavouriteToursByUserId(userId);
        return ResponseEntity.ok(favouriteTours);
    }

    @PostMapping("/{userId}/favourites/add")
    public ResponseEntity<String> addFavouriteTour(
            @PathVariable Long userId,
            @RequestParam Long tourId) {
        userService.addFavouriteTour(userId, tourId);
        return ResponseEntity.ok("Tour added to favourites successfully");
    }

    @DeleteMapping("/{userId}/favourites/delete")
    public ResponseEntity<String> removeFavouriteTour(
            @PathVariable Long userId,
            @RequestParam Long tourId) {
        userService.removeFavouriteTour(userId, tourId);
        return ResponseEntity.ok("Tour removed from favourites successfully");
    }

    @PutMapping("/{id}/update-profile")
    public ResponseEntity<User> updateUserProfile(
            @PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "fullName", required = false) String fullName,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "dateOfBirth", required = false) String dateOfBirth,
            @RequestParam(value = "gender", required = false) String gender) {
        try {
            String avatarUrl = file != null ? cloudinaryService.uploadFile(file) : null;
            User updatedUser = userService.updateUserProfile(id, fullName, address, dateOfBirth, gender, avatarUrl);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User user) {
        User updatedUser = userService.updateUser(id, user);
        return ResponseEntity.ok(updatedUser);
    }
}