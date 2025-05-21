package iuh.fit.se.chatbotservice.service.impl;

import iuh.fit.se.chatbotservice.dto.ChatRequest;
import iuh.fit.se.chatbotservice.dto.ChatResponse;
import iuh.fit.se.chatbotservice.entity.Message;
import iuh.fit.se.chatbotservice.repository.MessageRepository;
import iuh.fit.se.chatbotservice.service.ChatService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ChatServiceImpl implements ChatService {

    @Value("${chatbot.server.url:http://localhost:5000/query}")
    private String chatbotServerUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final MessageRepository messageRepository;

    public ChatServiceImpl(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @Override
    public List<Message> sendMessageToNodeServer(ChatRequest chatRequest) {
        Map<String, String> payload = new HashMap<>();
        payload.put("sender", chatRequest.getSender());
        payload.put("message", chatRequest.getMessage());

        Map<String, Object> nodeResponse = restTemplate.postForObject(chatbotServerUrl, payload, Map.class);

        Message userMessage = new Message();
        userMessage.setUserId(Long.parseLong(chatRequest.getSender()));
        userMessage.setMessage(chatRequest.getMessage());
        userMessage.setTimestamp(LocalDateTime.now());
        messageRepository.save(userMessage);

        List<Message> messages = new ArrayList<>();
        messages.add(userMessage);

        if (nodeResponse != null) {
            String status = (String) nodeResponse.get("status");
            if ("error".equals(status)) {
                String error = (String) nodeResponse.get("error");
                Message errorMessage = new Message();
                errorMessage.setUserId(Long.parseLong(chatRequest.getSender()));
                errorMessage.setMessage(error);
                errorMessage.setTimestamp(LocalDateTime.now());
                messageRepository.save(errorMessage);
                messages.add(errorMessage);
            } else {
                List<Map<String, Object>> tours = (List<Map<String, Object>>) nodeResponse.get("tours");
                List<String> suggestions = (List<String>) nodeResponse.get("suggestions");
                String responseText = (String) nodeResponse.get("response");

                StringBuilder combinedBotResponse = new StringBuilder();

                if (tours != null && !tours.isEmpty()) {
                    for (Map<String, Object> tour : tours) {
                        double price;
                        int duration;
                        Object priceObj = tour.get("price");
                        Object durationObj = tour.get("duration");

                        if (priceObj instanceof Number) {
                            price = ((Number) priceObj).doubleValue();
                        } else {
                            price = Double.parseDouble(priceObj.toString());
                        }

                        if (durationObj instanceof Number) {
                            duration = ((Number) durationObj).intValue();
                        } else {
                            // Trích xuất số từ chuỗi như "5 days 4 nights"
                            String durationStr = durationObj.toString();
                            Pattern pattern = Pattern.compile("\\d+");
                            Matcher matcher = pattern.matcher(durationStr);
                            if (matcher.find()) {
                                duration = Integer.parseInt(matcher.group());
                            } else {
                                duration = 0; // Giá trị mặc định nếu không tìm thấy số
                            }
                        }

                        String tourText = String.format(
                                "⭐ Tour: %s (ID: %d)\n📍 Địa điểm: %s\n💬 Mô tả: %s\n💵 Giá: %.2f\n🕒 Thời gian: %d\n📌 Loại tour: %s",
                                tour.get("title"), tour.get("id"), tour.get("location"),
                                tour.get("description"), price, duration, tour.get("tourType")
                        );
                        if (combinedBotResponse.length() > 0) {
                            combinedBotResponse.append("\n\n");
                        }
                        combinedBotResponse.append(tourText);
                    }
                }

                if (suggestions != null && !suggestions.isEmpty()) {
                    if (combinedBotResponse.length() > 0) {
                        combinedBotResponse.append("\n\n");
                    }
                    combinedBotResponse.append(String.join("\n", suggestions));
                }

                if (responseText != null && !responseText.isEmpty()) {
                    if (combinedBotResponse.length() > 0) {
                        combinedBotResponse.append("\n\n");
                    }
                    combinedBotResponse.append(responseText);
                }

                if (combinedBotResponse.length() > 0) {
                    Message botMessage = new Message();
                    botMessage.setUserId(Long.parseLong(chatRequest.getSender()));
                    botMessage.setMessage(combinedBotResponse.toString());
                    botMessage.setTimestamp(LocalDateTime.now());
                    messageRepository.save(botMessage);
                    messages.add(botMessage);
                }
            }
        }

        return messages;
    }

    @Override
    public ChatResponse handleChat(ChatRequest chatRequest) {
        List<Message> messages = sendMessageToNodeServer(chatRequest);

        if (messages.size() > 1) {
            StringBuilder consolidatedResponse = new StringBuilder();
            for (Message msg : messages) {
                if (!msg.getMessage().equals(chatRequest.getMessage())) {
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
                messages.clear();
                messages.add(consolidatedMessage);
            }
        }

        return new ChatResponse(messages);
    }

    @Override
    public void resetTokens() {
        String resetTokensUrl = "http://localhost:5000/reset_tokens";
        try {
            restTemplate.postForObject(resetTokensUrl, null, String.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to reset tokens on Node.js server: " + e.getMessage(), e);
        }
    }
}