package iuh.fit.se.chatbotservice.controller;

import iuh.fit.se.chatbotservice.dto.ChatRequest;
import iuh.fit.se.chatbotservice.dto.ChatResponse;
import iuh.fit.se.chatbotservice.entity.Message;
import iuh.fit.se.chatbotservice.service.ChatService;
//import iuh.fit.se.chatbotservice.service.DatabaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chatbot")
public class ChatController {
    @Autowired
    private ChatService chatService;

//    @Autowired
//    private DatabaseService databaseService;

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {
        // Gọi handleChat để xử lý câu hỏi
        return chatService.handleChat(request);
    }

    @PostMapping("/reset_tokens")
    public ResponseEntity<String> resetTokens() {
        try {
            chatService.resetTokens();
            return ResponseEntity.ok("Token count reset successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to reset tokens: " + e.getMessage());
        }
    }
}
