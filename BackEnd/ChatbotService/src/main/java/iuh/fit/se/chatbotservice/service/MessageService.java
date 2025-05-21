package iuh.fit.se.chatbotservice.service;

import iuh.fit.se.chatbotservice.entity.Message;

import java.util.List;

public interface MessageService {
    List<Message> getAllMessages();
    Message getMessageById(Long id);
}
