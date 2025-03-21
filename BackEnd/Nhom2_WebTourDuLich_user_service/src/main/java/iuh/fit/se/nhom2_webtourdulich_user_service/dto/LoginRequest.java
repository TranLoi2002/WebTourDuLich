package iuh.fit.se.nhom2_webtourdulich_user_service.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
