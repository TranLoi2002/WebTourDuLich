package iuh.fit.se.catalogservice.service.impl;

import iuh.fit.se.catalogservice.model.Tour;
import iuh.fit.se.catalogservice.repository.TourRepository;
import iuh.fit.se.catalogservice.service.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TourServiceImpl implements TourService {
    @Autowired
    private TourRepository tourRepository;

    public TourServiceImpl() {
        super();
    }

    @Override
    public int hashCode() {
        return super.hashCode();
    }

    @Override
    public List<Tour> getAllTours() {
        return tourRepository.findAll();
    }

    @Override
    public Optional<Tour> getTourById(Long id) {
        return tourRepository.findById(id);
    }

    @Override
    public Tour saveTour(Tour tour) {
        return tourRepository.save(tour);
    }

    @Override
    public Tour updateTour(Long id, Tour tour) {
        return tourRepository.findById(id)
                .map(existingTour -> {
                    existingTour.setTitle(tour.getTitle());
                    existingTour.setDescription(tour.getDescription());
                    existingTour.setPrice(tour.getPrice());
                    existingTour.setDuration(tour.getDuration());
                    existingTour.setStartDate(tour.getStartDate());
                    existingTour.setEndDate(tour.getEndDate());
                    existingTour.setMaxParticipants(tour.getMaxParticipants());
                    existingTour.setCurrentParticipants(tour.getCurrentParticipants());
                    existingTour.setThumbnail(tour.getThumbnail());
                    existingTour.setImages(tour.getImages());
                    if (tour.getLocation() != null) {
                        existingTour.setLocation(tour.getLocation());
                    } else {
                        throw new IllegalArgumentException("Location must not be null");
                    }
                    return tourRepository.save(existingTour);
                }).orElseThrow(() -> new RuntimeException("Tour not found with id " + id));
    }

    @Override
    public void deleteTour(Long id) {
        tourRepository.deleteById(id);
    }
}
