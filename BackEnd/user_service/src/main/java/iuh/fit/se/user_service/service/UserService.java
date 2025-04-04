package iuh.fit.se.user_service.service;

import iuh.fit.se.user_service.model.User;

import java.util.List;

public interface UserService {
    User findByUsername(String username);
}
