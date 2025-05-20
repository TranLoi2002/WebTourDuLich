package iuh.fit.se.chatbotservice.controller;

import iuh.fit.se.chatbotservice.entity.Message;
import iuh.fit.se.chatbotservice.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/database")
public class DatabaseController {

    @Autowired
    private MessageService messageService;

    @GetMapping("/messages")
    public List<Message> getAllMessages() {
        return messageService.getAllMessages();
    }

    @GetMapping("/messages/{id}")
    public Message getMessageById(@PathVariable Long id) {
        return messageService.getMessageById(id);
    }
}
