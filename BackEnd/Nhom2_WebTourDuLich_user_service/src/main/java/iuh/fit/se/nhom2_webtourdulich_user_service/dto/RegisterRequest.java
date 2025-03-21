package iuh.fit.se.nhom2_webtourdulich_user_service.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private String name;
    private String phone;
    private Long roleId;
}
