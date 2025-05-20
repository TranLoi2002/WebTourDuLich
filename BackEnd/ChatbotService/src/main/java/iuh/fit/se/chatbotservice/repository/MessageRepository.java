package iuh.fit.se.chatbotservice.repository;

import iuh.fit.se.chatbotservice.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
}
