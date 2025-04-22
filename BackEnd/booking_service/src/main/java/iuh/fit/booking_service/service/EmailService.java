package iuh.fit.booking_service.service;

import iuh.fit.booking_service.dto.TourDTO;
import iuh.fit.booking_service.dto.UserDTO;
import iuh.fit.booking_service.entity.Booking;

public interface EmailService {
    void sendBookingConfirmation(Booking booking, UserDTO user, TourDTO tour);
    void sendPaymentConfirmation(Booking booking, String qrCodeData);
    void sendBookingCancellationNotification(Booking booking, UserDTO user, TourDTO tour, String reason);
}