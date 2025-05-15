package iuh.fit.user_service.service;

import iuh.fit.user_service.model.User;
import org.springframework.stereotype.Service;

<<<<<<< HEAD
import java.util.List;


=======
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
public interface UserService {
    User findByUsername(String username);

    User findById(Long id);
<<<<<<< HEAD
    List<User> findAll();
}
=======

    void addFavouriteTour(Long userId, Long tourId);

    void removeFavouriteTour(Long userId, Long tourId);

    User updateUserProfile(Long id, String fullName, String address, String dateOfBirth, String gender, String avatarUrl);

    User updateUser(Long id, User user);
}
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
