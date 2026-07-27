package com.smartparking.repository;

import com.smartparking.entity.Vehicle;
import com.smartparking.enums.VehicleType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);

    @Query("SELECT v FROM Vehicle v WHERE v.vehicleNumber = :vehicleNumber AND (:companyId IS NULL OR v.company.id = :companyId)")
    Optional<Vehicle> findByVehicleNumberAndCompanyId(@Param("vehicleNumber") String vehicleNumber, @Param("companyId") Long companyId);

    Boolean existsByVehicleNumber(String vehicleNumber);

    @Query("SELECT CASE WHEN COUNT(v) > 0 THEN true ELSE false END FROM Vehicle v WHERE v.vehicleNumber = :vehicleNumber AND (:companyId IS NULL OR v.company.id = :companyId)")
    Boolean existsByVehicleNumberAndCompanyId(@Param("vehicleNumber") String vehicleNumber, @Param("companyId") Long companyId);

    @Query("SELECT v FROM Vehicle v WHERE " +
           "(:companyId IS NULL OR v.company.id = :companyId) AND (" +
           "LOWER(v.vehicleNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.ownerName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.ownerContact) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Vehicle> searchVehiclesScoped(@Param("query") String query, @Param("companyId") Long companyId, Pageable pageable);

    @Query("SELECT COUNT(v) FROM Vehicle v WHERE v.vehicleType = :vehicleType AND (:companyId IS NULL OR v.company.id = :companyId)")
    long countByVehicleTypeAndCompanyId(@Param("vehicleType") VehicleType vehicleType, @Param("companyId") Long companyId);
}
