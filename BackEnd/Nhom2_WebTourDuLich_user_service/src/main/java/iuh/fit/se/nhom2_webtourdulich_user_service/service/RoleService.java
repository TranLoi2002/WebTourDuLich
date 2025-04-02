package iuh.fit.se.nhom2_webtourdulich_user_service.service;

import iuh.fit.se.nhom2_webtourdulich_user_service.model.Role;

import java.util.List;

public interface RoleService {
    List<Role> getAllRoles();
    Role createRole(Role role);
}
