package iuh.fit.se.catalogservice.mapper;

import iuh.fit.se.catalogservice.dto.TourDTO;
import iuh.fit.se.catalogservice.model.Location;
import iuh.fit.se.catalogservice.model.Tour;
import iuh.fit.se.catalogservice.model.TourStatus;
import iuh.fit.se.catalogservice.model.TourType;

import java.util.Date;

public class TourMapper {

    public static Tour toEntity(TourDTO dto, Location location, TourType tourType) {
        Tour tour = new Tour();
        tour.setTitle(dto.getTitle());

        tour.setTourCode(dto.getTourCode());

        tour.setDescription(dto.getDescription());
        tour.setHighlights(dto.getHighlights());
        tour.setActivityTour(dto.isActivityTour());
        tour.setDiscount(dto.getDiscount());
        tour.setPlaceOfDeparture(dto.getPlaceOfDeparture());
        tour.setPrice(dto.getPrice());

        String duration = calculateDuration(dto.getStartDate(), dto.getEndDate());
        tour.setDuration(duration);

        tour.setStartDate(dto.getStartDate());
        tour.setEndDate(dto.getEndDate());

//        tour.setStartDate(dto.getStartDate());
//        tour.setEndDate(dto.getEndDate());
        tour.setStatus(calculateStatus(dto.getStartDate(), dto.getEndDate()));

        tour.setMaxParticipants(dto.getMaxParticipants());
        tour.setCurrentParticipants(dto.getCurrentParticipants());
        tour.setThumbnail(dto.getThumbnail());
        tour.setImages(dto.getImages());
        tour.setLocation(location);
        tour.setTourType(tourType);
        tour.setActive(true);
        return tour;
    }

    public static TourStatus calculateStatus(Date startDate, Date endDate) {
        Date now = new Date();
        if (now.before(startDate)) {
            return TourStatus.UPCOMING;
        } else if (now.after(endDate)) {
            return TourStatus.COMPLETED;
        } else {
            return TourStatus.ONGOING;
        }
    }

    public static String calculateDuration(Date startDate, Date endDate) {
        long diffInMillies = Math.abs(endDate.getTime() - startDate.getTime());
        long diffInDays = diffInMillies / (1000 * 60 * 60 * 24);

        if (diffInDays == 0) {
            return "1 day";
        }

        return (diffInDays + 1) + " days " + diffInDays + " nights";
    }


}
