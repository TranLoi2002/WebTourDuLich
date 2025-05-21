package iuh.fit.se.chatbotservice.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class ChatRequest {
    private String sender;
    private String message;

}
