package iuh.fit.user_service.dto;

import iuh.fit.user_service.model.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private User user;

    public AuthResponse(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
    public AuthResponse(String accessToken, String refreshToken,User user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
    }
}
