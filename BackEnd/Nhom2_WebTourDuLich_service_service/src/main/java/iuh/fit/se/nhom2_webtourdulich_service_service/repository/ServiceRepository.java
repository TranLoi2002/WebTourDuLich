package iuh.fit.se.nhom2_webtourdulich_service_service.repository;

import iuh.fit.se.nhom2_webtourdulich_service_service.model.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<Services, Long> {
}