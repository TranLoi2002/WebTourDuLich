package iuh.fit.se.user_service.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TokenResponse {
    private String accessToken;
    private String refreshToken;
}
