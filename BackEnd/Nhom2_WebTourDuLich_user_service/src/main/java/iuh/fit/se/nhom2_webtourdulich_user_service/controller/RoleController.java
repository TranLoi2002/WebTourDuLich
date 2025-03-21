package iuh.fit.se.nhom2_webtourdulich_user_service.controller;

import iuh.fit.se.nhom2_webtourdulich_user_service.model.Role;
import iuh.fit.se.nhom2_webtourdulich_user_service.repository.RoleRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/roles")
public class RoleController {
    private final RoleRepository roleRepository;

    public RoleController(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @GetMapping
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @PostMapping
    public Role createRole(@RequestBody Role role) {
        return roleRepository.save(role);
    }
}

