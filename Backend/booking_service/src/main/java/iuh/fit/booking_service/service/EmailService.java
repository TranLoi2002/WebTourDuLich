package iuh.fit.booking_service.service;

import iuh.fit.booking_service.entity.Booking;

public interface EmailService {
    void sendBookingConfirmation(Booking booking);
    void sendPaymentConfirmation(Booking booking, String qrCodeData);
}