package iuh.fit.se.blogservice.dto;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String userName;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String address;
    private String avatar;
    private String roleName;
}
