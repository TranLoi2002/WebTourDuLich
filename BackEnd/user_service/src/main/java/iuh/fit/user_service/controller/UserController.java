package iuh.fit.user_service.controller;

import iuh.fit.user_service.dto.TourDTO;
import iuh.fit.user_service.feign.CatalogFeignClient;
import iuh.fit.user_service.model.User;
import iuh.fit.user_service.repository.UserRepository;
import iuh.fit.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private CatalogFeignClient catalogFeignClient;
//
//    @GetMapping("/{username}")
//    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
//        User user = userService.findByUsername(username);
//        return ResponseEntity.ok(user);
//    }
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{userId}/favourites")
    public List<TourDTO> getUserFavouriteTours(@PathVariable Long userId) {
        return catalogFeignClient.getFavouriteToursByUserId(userId);
    }

    @PostMapping("/{userId}/favourites/add")
    public ResponseEntity<String> addFavouriteTour(@PathVariable Long userId, @RequestParam Long tourId) {
        userService.addFavouriteTour(userId, tourId);
        return ResponseEntity.ok("Tour added to favourites successfully");
    }

    @DeleteMapping("/{userId}/favourites/delete")
    public ResponseEntity<String> removeFavouriteTour(@PathVariable Long userId, @RequestParam Long tourId) {
        userService.removeFavouriteTour(userId, tourId);
        return ResponseEntity.ok("Tour removed from favourites successfully");
    }
}
