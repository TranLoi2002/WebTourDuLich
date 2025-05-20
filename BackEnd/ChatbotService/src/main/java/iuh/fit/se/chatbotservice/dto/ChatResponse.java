package iuh.fit.se.chatbotservice.dto;

import iuh.fit.se.chatbotservice.entity.Message;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class ChatResponse {
    private List<Message> responses;

    public ChatResponse(List<Message> responses) {
        this.responses = responses;
    }
}
