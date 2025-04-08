package iuh.fit.se.service;

import iuh.fit.se.model.User;

import java.util.List;

public interface UserService {
    User findByUsername(String username);
}
