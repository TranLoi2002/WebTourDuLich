package iuh.fit.se.repository;

import iuh.fit.se.entity.Booking;
import iuh.fit.se.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;


@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {




}