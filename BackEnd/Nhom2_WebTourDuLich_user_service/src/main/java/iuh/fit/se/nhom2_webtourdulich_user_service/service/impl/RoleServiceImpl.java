package iuh.fit.se.nhom2_webtourdulich_user_service.service.impl;

import iuh.fit.se.nhom2_webtourdulich_user_service.model.Role;
import iuh.fit.se.nhom2_webtourdulich_user_service.repository.RoleRepository;
import iuh.fit.se.nhom2_webtourdulich_user_service.service.RoleService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {


    private RoleRepository roleRepository;

    @Autowired
    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }


    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Role createRole(Role role) {
        return roleRepository.save(role);
    }

}
