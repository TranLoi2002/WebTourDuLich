package iuh.fit.se.catalogservice.service.impl;

import com.netflix.discovery.converters.Auto;
import iuh.fit.se.catalogservice.dto.TourDTO;
import iuh.fit.se.catalogservice.feign.ReviewServiceFeignClient;
import iuh.fit.se.catalogservice.mapper.TourMapper;
import iuh.fit.se.catalogservice.model.Location;
import iuh.fit.se.catalogservice.model.Tour;
import iuh.fit.se.catalogservice.model.TourStatus;
import iuh.fit.se.catalogservice.model.TourType;
import iuh.fit.se.catalogservice.repository.LocationRepository;
import iuh.fit.se.catalogservice.repository.TourRepository;
import iuh.fit.se.catalogservice.repository.TourTypeRepository;
import iuh.fit.se.catalogservice.service.TourService;
import iuh.fit.se.catalogservice.util.PaginationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class TourServiceImpl implements TourService {
    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private ReviewServiceFeignClient reviewServiceFeignClient;
    @Autowired
    private LocationRepository locationRepository;
    @Autowired
    private TourTypeRepository tourTypeRepository;

    public TourServiceImpl() {
        super();
    }

    @Override
    public int hashCode() {
        return super.hashCode();
    }

    @Override
    public Map<String, Object> getAllTours(Map<String, String> params) {
        Pageable pageable = PaginationUtil.createPageable(params);
        Page<Tour> page = tourRepository.findAll(pageable);

        // Fetch ratings for each tour
        for (Tour tour : page.getContent()) {
            try {
                Map<String, Object> ratings = reviewServiceFeignClient.getTourRating(tour.getId());
                tour.setAverageRating((Double) ratings.get("averageRating"));
                tour.setTotalReviews(((Number) ratings.get("totalReviews")).longValue());
            } catch (Exception e) {
                tour.setAverageRating(0.0);
                tour.setTotalReviews(0L);
            }
        }

        return PaginationUtil.createResponse(page);
    }

    @Override
    public List<Tour> getTourByIsActive(boolean isActive) {
        return tourRepository.findByIsActive(isActive);
    }

//    @Override
//    public Optional<Tour> getTourById(Long id) {
//        return tourRepository.findById(id);
//    }

    @Override
    public Tour saveTour(TourDTO dto) {
        Location location = locationRepository.findById(dto.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        TourType tourType = tourTypeRepository.findById(dto.getTourTypeId())
                .orElseThrow(() -> new RuntimeException("TourType not found"));

        Tour tour = TourMapper.toEntity(dto, location, tourType);

        String tourCode = generateUniqueTourCode(tourType.getName(), dto.getStartDate(), tourRepository);
        tour.setTourCode(tourCode);

        return tourRepository.save(tour);
    }


    @Override
    public Tour updateTour(Long id, TourDTO dto) {
        Tour existingTour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found with id " + id));

        Location location = locationRepository.findById(dto.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        TourType tourType = tourTypeRepository.findById(dto.getTourTypeId())
                .orElseThrow(() -> new RuntimeException("TourType not found"));

        // Update fields
        existingTour.setTitle(dto.getTitle());

        String tourCode = generateUniqueTourCode(tourType.getName(), dto.getStartDate(), tourRepository);
        existingTour.setTourCode(tourCode);

        existingTour.setDescription(dto.getDescription());
        existingTour.setHighlights(dto.getHighlights());
        existingTour.setActivityTour(dto.isActivityTour());
        existingTour.setDiscount(dto.getDiscount());
        existingTour.setPlaceOfDeparture(dto.getPlaceOfDeparture());
        existingTour.setPrice(dto.getPrice());

        String duration = calculateDuration(dto.getStartDate(), dto.getEndDate());
        existingTour.setDuration(duration);

        existingTour.setStartDate(dto.getStartDate());
        existingTour.setEndDate(dto.getEndDate());
        existingTour.setStatus(calculateStatus(dto.getStartDate(), dto.getEndDate()));

        existingTour.setMaxParticipants(dto.getMaxParticipants());
        existingTour.setCurrentParticipants(dto.getCurrentParticipants());
        existingTour.setThumbnail(dto.getThumbnail());
        existingTour.setImages(dto.getImages());
        existingTour.setLocation(location);
        existingTour.setTourType(tourType);

        return tourRepository.save(existingTour);
    }

    public TourStatus calculateStatus(Date startDate, Date endDate) {
        Date now = new Date();
        if (now.before(startDate)) {
            return TourStatus.UPCOMING;
        } else if (now.after(endDate)) {
            return TourStatus.COMPLETED;
        } else {
            return TourStatus.ONGOING;
        }
    }

    @Override
    @Scheduled(cron = "0 0 0 * * *") // Mỗi ngày lúc 0h
    @Transactional // Ensure proper transaction management
    public void updateTourStatuses() {
        List<Tour> tours = tourRepository.findAll();
        Date now = new Date();

        for (Tour tour : tours) {
            TourStatus newStatus = calculateStatus(tour.getStartDate(), tour.getEndDate());

            if (tour.getStatus() != newStatus) {
                tourRepository.updateTourStatus(tour.getId(), newStatus);
            }
        }

    }

    public static String generateUniqueTourCode(String tourType, Date startDate, TourRepository tourRepository) {
        SimpleDateFormat sdf = new SimpleDateFormat("ddMMyy");
        String dateStr = sdf.format(startDate);

        // Extract the first three uppercase letters from tourType
        String tourTypeCode = tourType.toUpperCase().replaceAll("[^A-Z]", "").substring(0, Math.min(3, tourType.length()));

        // Create the base code
        String baseCode = tourTypeCode + "-" + dateStr;
        String finalCode = baseCode;
        int counter = 1;

        // Ensure the code is unique
        while (tourRepository.existsByTourCode(finalCode)) {
            finalCode = baseCode + "-" + String.format("%02d", counter);
            counter++;
        }

        return finalCode;
    }

    public static String calculateDuration(Date startDate, Date endDate) {
        long diffInMillies = Math.abs(endDate.getTime() - startDate.getTime());
        long diffInDays = diffInMillies / (1000 * 60 * 60 * 24);

        if (diffInDays == 0) {
            return "1 day";
        }

        return (diffInDays + 1) + " days " + diffInDays + " nights";
    }




    @Override
    public void deleteTour(Long id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found with id " + id));
        tour.setActive(false);
        tourRepository.save(tour);
    }

    @Override
    public List<Tour> getToursByTourTypeId(Long tourTypeId) {
        return tourRepository.findByTourTypeId(tourTypeId);
    }

    @Override
    public List<Tour> getToursByActivityType(String activityTypeName) {
        return tourRepository.findToursByActivityType(activityTypeName);
    }

    @Override
    public Optional<Tour> getTourByIdWithRating(Long id) {
        Optional<Tour> tour = tourRepository.findById(id);

        if (tour.isPresent()) {
            Map<String, Object> ratings = reviewServiceFeignClient.getTourRating(id);
            tour.get().setAverageRating((Double) ratings.get("averageRating"));
            tour.get().setTotalReviews(((Number) ratings.get("totalReviews")).longValue());
        }

        return tour;
    }

    @Override
    public List<Map<String, Object>> getReviewsByTourId(Long tourId) {
        return reviewServiceFeignClient.getReviewsByTourId(tourId);
    }
    @Override
    public Tour updateCurrentParticipants(Long id, Integer currentParticipants) {
        return tourRepository.findById(id)
                .map(existingTour -> {
                    if (currentParticipants < 0 || currentParticipants > existingTour.getMaxParticipants()) {
                        throw new IllegalArgumentException("Current participants must be between 0 and max participants.");
                    }
                    existingTour.setCurrentParticipants(currentParticipants);
                    return tourRepository.save(existingTour);
                })
                .orElseThrow(() -> new RuntimeException("Tour not found with id " + id));
    }

    @Override
    public List<Tour> getRelatedToursByLocationId(Long locationId, Long excludeTourId, Pageable pageable) {
        return tourRepository.findRelatedToursByLocationId(locationId, excludeTourId, pageable);
    }


    @Override
    public List<Tour> getToursByLocationId(Long locationId) {
        return tourRepository.getToursByLocationId(locationId);
    }
}
