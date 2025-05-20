package iuh.fit.se.chatbotservice.service.impl;

import iuh.fit.se.chatbotservice.dto.ChatRequest;
import iuh.fit.se.chatbotservice.dto.ChatResponse;
import iuh.fit.se.chatbotservice.entity.Message;
import iuh.fit.se.chatbotservice.repository.MessageRepository;
import iuh.fit.se.chatbotservice.service.ChatService;
//import iuh.fit.se.chatbotservice.service.DatabaseService;
//import iuh.fit.se.chatbotservice.util.QuestionClassifier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatServiceImpl implements ChatService {

    @Value("${rasa.server.url}")
    private String rasaServerUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final MessageRepository messageRepository;

    public ChatServiceImpl(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @Override
    public List<Message> sendMessageToRasa(ChatRequest chatRequest) {
        // Create payload for Rasa
        Map<String, String> payload = new HashMap<>();
        payload.put("sender", chatRequest.getSender());
        payload.put("message", chatRequest.getMessage());

        // Send POST request to Rasa
        Map<String, Object>[] rasaResponse = restTemplate.postForObject(rasaServerUrl, payload, Map[].class);

        // Save user message
        Message userMessage = new Message();
        userMessage.setUserId(Long.parseLong(chatRequest.getSender()));
        userMessage.setMessage(chatRequest.getMessage());
        userMessage.setTimestamp(LocalDateTime.now());
        messageRepository.save(userMessage);

        // Combine Rasa responses into a single message
        StringBuilder combinedBotResponse = new StringBuilder();
        if (rasaResponse != null) {
            for (Map<String, Object> response : rasaResponse) {
                String text = (String) response.get("text");
                if (text != null && !text.isEmpty()) {
                    if (combinedBotResponse.length() > 0) {
                        combinedBotResponse.append("\n");
                    }
                    combinedBotResponse.append(text);
                }
            }
        }

        // Save and return combined response if it exists
        List<Message> messages = new ArrayList<>();
        messages.add(userMessage);
        if (combinedBotResponse.length() > 0) {
            Message botMessage = new Message();
            botMessage.setUserId(Long.parseLong(chatRequest.getSender()));
            botMessage.setMessage(combinedBotResponse.toString());
            botMessage.setTimestamp(LocalDateTime.now());
            messageRepository.save(botMessage);
            messages.add(botMessage);
        }

        return messages;
    }

    @Override
    public ChatResponse handleChat(ChatRequest chatRequest) {
        // All queries are now handled by Rasa, including database-related ones
        List<Message> messages = sendMessageToRasa(chatRequest);

        // Consolidate all messages into a single response if multiple exist
        if (messages.size() > 1) {
            StringBuilder consolidatedResponse = new StringBuilder();
            for (Message msg : messages) {
                if (!msg.getMessage().equals(chatRequest.getMessage())) { // Exclude user message
                    if (consolidatedResponse.length() > 0) {
                        consolidatedResponse.append("\n");
                    }
                    consolidatedResponse.append(msg.getMessage());
                }
            }
            if (consolidatedResponse.length() > 0) {
                Message consolidatedMessage = new Message();
                consolidatedMessage.setUserId(Long.parseLong(chatRequest.getSender()));
                consolidatedMessage.setMessage(consolidatedResponse.toString());
                consolidatedMessage.setTimestamp(LocalDateTime.now());
                messageRepository.save(consolidatedMessage);
                messages.clear(); // Remove individual messages
                messages.add(consolidatedMessage); // Add consolidated message
            }
        }

        return new ChatResponse(messages);
    }

    @Override
    public void resetTokens() {
        // Call the custom reset endpoint on the Rasa action server
        String resetTokensUrl = "http://localhost:5055/reset_tokens"; // Rasa action server port
        try {
            restTemplate.postForObject(resetTokensUrl, null, String.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to reset tokens on Rasa: " + e.getMessage(), e);
        }
    }

}