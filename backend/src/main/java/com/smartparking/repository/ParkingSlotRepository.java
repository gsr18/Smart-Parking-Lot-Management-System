package com.smartparking.repository;

import com.smartparking.entity.ParkingSlot;
import com.smartparking.enums.SlotStatus;
import com.smartparking.enums.SlotType;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {

    Optional<ParkingSlot> findBySlotNumber(String slotNumber);

    @Query("SELECT s FROM ParkingSlot s WHERE s.slotNumber = :slotNumber AND (:companyId IS NULL OR s.company.id = :companyId)")
    Optional<ParkingSlot> findBySlotNumberAndCompanyId(@Param("slotNumber") String slotNumber, @Param("companyId") Long companyId);

    Boolean existsBySlotNumber(String slotNumber);

    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM ParkingSlot s WHERE s.slotNumber = :slotNumber AND (:companyId IS NULL OR s.company.id = :companyId)")
    Boolean existsBySlotNumberAndCompanyId(@Param("slotNumber") String slotNumber, @Param("companyId") Long companyId);

    @Query("SELECT s FROM ParkingSlot s WHERE (:companyId IS NULL OR s.company.id = :companyId)")
    List<ParkingSlot> findByCompanyId(@Param("companyId") Long companyId);

    @Modifying
    @Query("DELETE FROM ParkingSlot s WHERE s.company.id = :companyId")
    int deleteAllByCompanyId(@Param("companyId") Long companyId);

    List<ParkingSlot> findByStatus(SlotStatus status);

    @Query("SELECT s FROM ParkingSlot s WHERE s.status = :status AND (:companyId IS NULL OR s.company.id = :companyId)")
    List<ParkingSlot> findByStatusAndCompanyId(@Param("status") SlotStatus status, @Param("companyId") Long companyId);

    List<ParkingSlot> findByFloorNumberOrderBySlotNumberAsc(Integer floorNumber);

    @Query("SELECT s FROM ParkingSlot s WHERE s.floorNumber = :floorNumber AND (:companyId IS NULL OR s.company.id = :companyId) ORDER BY s.slotNumber ASC")
    List<ParkingSlot> findByFloorNumberAndCompanyIdOrderBySlotNumberAsc(@Param("floorNumber") Integer floorNumber, @Param("companyId") Long companyId);

    List<ParkingSlot> findBySlotTypeAndStatus(SlotType slotType, SlotStatus status);

    @Query("SELECT s FROM ParkingSlot s WHERE s.slotType = :slotType AND s.status = :status AND (:companyId IS NULL OR s.company.id = :companyId)")
    List<ParkingSlot> findBySlotTypeAndStatusAndCompanyId(@Param("slotType") SlotType slotType, @Param("status") SlotStatus status, @Param("companyId") Long companyId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM ParkingSlot s WHERE s.slotType = :slotType AND s.status = :status AND (:companyId IS NULL OR s.company.id = :companyId) ORDER BY s.floorNumber ASC, s.slotNumber ASC")
    List<ParkingSlot> findAvailableSlotsWithLock(@Param("slotType") SlotType slotType, @Param("status") SlotStatus status, @Param("companyId") Long companyId);

    long countByStatus(SlotStatus status);

    @Query("SELECT COUNT(s) FROM ParkingSlot s WHERE (:companyId IS NULL OR s.company.id = :companyId)")
    long countByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT COUNT(s) FROM ParkingSlot s WHERE s.status = :status AND (:companyId IS NULL OR s.company.id = :companyId)")
    long countByStatusAndCompanyId(@Param("status") SlotStatus status, @Param("companyId") Long companyId);

    long countBySlotTypeAndStatus(SlotType slotType, SlotStatus status);

    @Query("SELECT DISTINCT s.floorNumber FROM ParkingSlot s WHERE (:companyId IS NULL OR s.company.id = :companyId) ORDER BY s.floorNumber ASC")
    List<Integer> findDistinctFloorNumbers(@Param("companyId") Long companyId);
}
