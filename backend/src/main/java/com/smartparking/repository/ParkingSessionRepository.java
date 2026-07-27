package com.smartparking.repository;

import com.smartparking.entity.ParkingSession;
import com.smartparking.enums.ParkingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingSessionRepository extends JpaRepository<ParkingSession, Long> {

    Optional<ParkingSession> findByVehicleVehicleNumberAndStatus(String vehicleNumber, ParkingStatus status);

    @Query("SELECT s FROM ParkingSession s WHERE s.vehicle.vehicleNumber = :vehicleNumber AND s.status = :status AND (:companyId IS NULL OR s.company.id = :companyId)")
    Optional<ParkingSession> findByVehicleVehicleNumberAndStatusAndCompanyId(@Param("vehicleNumber") String vehicleNumber, @Param("status") ParkingStatus status, @Param("companyId") Long companyId);

    Optional<ParkingSession> findByParkingSlotSlotNumberAndStatus(String slotNumber, ParkingStatus status);

    @Query("SELECT s FROM ParkingSession s WHERE s.parkingSlot.slotNumber = :slotNumber AND s.status = :status AND (:companyId IS NULL OR s.company.id = :companyId)")
    Optional<ParkingSession> findByParkingSlotSlotNumberAndStatusAndCompanyId(@Param("slotNumber") String slotNumber, @Param("status") ParkingStatus status, @Param("companyId") Long companyId);

    Boolean existsByVehicleVehicleNumberAndStatus(String vehicleNumber, ParkingStatus status);

    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM ParkingSession s WHERE s.vehicle.vehicleNumber = :vehicleNumber AND s.status = :status AND (:companyId IS NULL OR s.company.id = :companyId)")
    Boolean existsByVehicleVehicleNumberAndStatusAndCompanyId(@Param("vehicleNumber") String vehicleNumber, @Param("status") ParkingStatus status, @Param("companyId") Long companyId);

    List<ParkingSession> findByStatus(ParkingStatus status);

    @Query("SELECT s FROM ParkingSession s WHERE s.status = :status AND (:companyId IS NULL OR s.company.id = :companyId)")
    List<ParkingSession> findByStatusAndCompanyId(@Param("status") ParkingStatus status, @Param("companyId") Long companyId);

    @Query("SELECT s FROM ParkingSession s WHERE s.status = :status AND (:companyId IS NULL OR s.company.id = :companyId) AND (:staffId IS NULL OR s.staffUser.id = :staffId)")
    List<ParkingSession> findByStatusAndCompanyIdAndStaffUserId(@Param("status") ParkingStatus status, @Param("companyId") Long companyId, @Param("staffId") Long staffId);

    Page<ParkingSession> findByStatusOrderByEntryTimeDesc(ParkingStatus status, Pageable pageable);

    @Query("SELECT s FROM ParkingSession s WHERE s.status = :status AND (:companyId IS NULL OR s.company.id = :companyId) ORDER BY s.entryTime DESC")
    Page<ParkingSession> findByStatusAndCompanyIdOrderByEntryTimeDesc(@Param("status") ParkingStatus status, @Param("companyId") Long companyId, Pageable pageable);

    @Query("SELECT s FROM ParkingSession s WHERE s.status = :status AND (:companyId IS NULL OR s.company.id = :companyId) AND (:staffId IS NULL OR s.staffUser.id = :staffId) ORDER BY s.entryTime DESC")
    Page<ParkingSession> findByStatusAndCompanyIdAndStaffUserIdOrderByEntryTimeDesc(@Param("status") ParkingStatus status, @Param("companyId") Long companyId, @Param("staffId") Long staffId, Pageable pageable);

    Page<ParkingSession> findByVehicleVehicleNumberOrderByEntryTimeDesc(String vehicleNumber, Pageable pageable);

    @Query("SELECT s FROM ParkingSession s WHERE " +
           "(:companyId IS NULL OR s.company.id = :companyId) AND " +
           "(:staffId IS NULL OR s.staffUser.id = :staffId) AND " +
           "(:vehicleNumber IS NULL OR LOWER(s.vehicle.vehicleNumber) LIKE LOWER(CONCAT('%', :vehicleNumber, '%'))) AND " +
           "(:status IS NULL OR s.status = :status) AND " +
           "(:startDate IS NULL OR s.entryTime >= :startDate) AND " +
           "(:endDate IS NULL OR s.entryTime <= :endDate)")
    Page<ParkingSession> filterHistoryScoped(
            @Param("companyId") Long companyId,
            @Param("staffId") Long staffId,
            @Param("vehicleNumber") String vehicleNumber,
            @Param("status") ParkingStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );

    long countByStatus(ParkingStatus status);

    @Query("SELECT COUNT(s) FROM ParkingSession s WHERE s.status = :status AND (:companyId IS NULL OR s.company.id = :companyId)")
    long countByStatusAndCompanyId(@Param("status") ParkingStatus status, @Param("companyId") Long companyId);

    @Query("SELECT COUNT(s) FROM ParkingSession s WHERE s.status = :status AND (:companyId IS NULL OR s.company.id = :companyId) AND (:staffId IS NULL OR s.staffUser.id = :staffId)")
    long countByStatusAndCompanyIdAndStaffUserId(@Param("status") ParkingStatus status, @Param("companyId") Long companyId, @Param("staffId") Long staffId);

    long countByEntryTimeBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT(s) FROM ParkingSession s WHERE s.entryTime >= :start AND (:companyId IS NULL OR s.company.id = :companyId OR s.company IS NULL)")
    long countByEntryTimeBetweenAndCompanyId(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end, @Param("companyId") Long companyId);

    @Query("SELECT COALESCE(SUM(s.parkingFee), 0) FROM ParkingSession s WHERE s.status = com.smartparking.enums.ParkingStatus.COMPLETED AND s.exitTime >= :start AND (:companyId IS NULL OR s.company.id = :companyId OR s.company IS NULL) AND (:staffId IS NULL OR s.staffUser.id = :staffId)")
    BigDecimal calculateRevenueBetweenScoped(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end, @Param("companyId") Long companyId, @Param("staffId") Long staffId);

    @Query("SELECT COALESCE(SUM(s.parkingFee), 0) FROM ParkingSession s WHERE s.status = com.smartparking.enums.ParkingStatus.COMPLETED AND (:companyId IS NULL OR s.company.id = :companyId OR s.company IS NULL)")
    BigDecimal calculateTotalLifetimeRevenueScoped(@Param("companyId") Long companyId);

    @Query("SELECT COALESCE(SUM(s.parkingFee), 0) FROM ParkingSession s WHERE s.status = com.smartparking.enums.ParkingStatus.COMPLETED AND s.vehicle.vehicleType = :vehicleType AND s.exitTime >= :start AND (:companyId IS NULL OR s.company.id = :companyId OR s.company IS NULL)")
    BigDecimal calculateRevenueByVehicleTypeAndPeriodScoped(@Param("vehicleType") com.smartparking.enums.VehicleType vehicleType, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end, @Param("companyId") Long companyId);

    @Query("SELECT s FROM ParkingSession s WHERE (:companyId IS NULL OR s.company.id = :companyId) AND (:staffId IS NULL OR s.staffUser.id = :staffId) ORDER BY s.entryTime DESC")
    List<ParkingSession> findRecentActivitiesScoped(@Param("companyId") Long companyId, @Param("staffId") Long staffId, Pageable pageable);
}
