package com.smartparking.repository;

import com.smartparking.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Optional<Reservation> findByCompanyIdAndVehicleNumberAndStatus(Long companyId, String vehicleNumber, String status);

    List<Reservation> findByCompanyIdOrderByStartTimeDesc(Long companyId);
}
