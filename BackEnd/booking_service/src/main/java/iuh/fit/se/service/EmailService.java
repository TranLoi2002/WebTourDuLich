package iuh.fit.se.service;

import iuh.fit.se.entity.Booking;

public interface EmailService {
    void sendBookingConfirmation(Booking booking);
    void sendPaymentConfirmation(Booking booking, String qrCodeData);
}