package com.smartparking.repository;

import com.smartparking.entity.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {

    List<MaintenanceRequest> findByCompanyIdOrderByCreatedAtDesc(Long companyId);

    List<MaintenanceRequest> findByCompanyIdAndStatus(Long companyId, String status);
}
