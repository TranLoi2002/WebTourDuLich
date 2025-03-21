package iuh.fit.se.nhom2_webtourdulich_service_service.service;


import iuh.fit.se.nhom2_webtourdulich_service_service.model.Services;
import iuh.fit.se.nhom2_webtourdulich_service_service.repository.ServiceRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    public List<Services> getAllServices() {
        return serviceRepository.findAll();
    }

    public Optional<Services> getServiceById(Long id) {
        return serviceRepository.findById(id);
    }

    public Services createService(Services service) {
        return serviceRepository.save(service);
    }

    public Services updateService(Long id, Services updatedService) {
        return serviceRepository.findById(id).map(service -> {
            service.setName(updatedService.getName());
            service.setPrice(updatedService.getPrice());
            service.setDescription(updatedService.getDescription());
            service.setIsActive(updatedService.getIsActive());
            return serviceRepository.save(service);
        }).orElseThrow(() -> new RuntimeException("Service not found"));
    }

    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }
}
