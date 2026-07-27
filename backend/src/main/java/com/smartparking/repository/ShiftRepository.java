package com.smartparking.repository;

import com.smartparking.entity.Shift;
import com.smartparking.enums.ShiftStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {

    Optional<Shift> findByUserIdAndStatus(Long userId, ShiftStatus status);

    List<Shift> findByCompanyIdOrderByStartTimeDesc(Long companyId);

    List<Shift> findByUserIdOrderByStartTimeDesc(Long userId);

    @Query("SELECT s FROM Shift s WHERE s.company.id = :companyId AND s.status = 'ACTIVE'")
    List<Shift> findActiveShiftsByCompanyId(@Param("companyId") Long companyId);
}
