package com.smartparking.repository;

import com.smartparking.entity.VehicleWatchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleWatchlistRepository extends JpaRepository<VehicleWatchlist, Long> {

    Optional<VehicleWatchlist> findByCompanyIdAndVehicleNumber(Long companyId, String vehicleNumber);

    List<VehicleWatchlist> findByCompanyIdOrderByCreatedAtDesc(Long companyId);

    boolean existsByCompanyIdAndVehicleNumber(Long companyId, String vehicleNumber);
}
