package iuh.fit.se.chatbotservice.service;

import iuh.fit.se.chatbotservice.dto.ChatRequest;
import iuh.fit.se.chatbotservice.dto.ChatResponse;
import iuh.fit.se.chatbotservice.entity.Message;

import java.util.List;

public interface ChatService {
    List<Message> sendMessageToRasa(ChatRequest chatRequest);

    ChatResponse handleChat(ChatRequest chatRequest);

    void resetTokens();
}
