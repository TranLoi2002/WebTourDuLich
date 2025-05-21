package iuh.fit.se.chatbotservice.service.impl;

import iuh.fit.se.chatbotservice.entity.Message;
import iuh.fit.se.chatbotservice.repository.MessageRepository;
import iuh.fit.se.chatbotservice.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {
    @Autowired
    private MessageRepository messageRepository;

    @Override
    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    @Override
    public Message getMessageById(Long id) {
        return messageRepository.findById(id).orElse(null);
    }
}
