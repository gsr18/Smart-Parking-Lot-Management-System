package com.smartparking.repository;

import com.smartparking.entity.Incident;
import com.smartparking.enums.IncidentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {

    List<Incident> findByCompanyIdOrderByCreatedAtDesc(Long companyId);

    List<Incident> findByCompanyIdAndStatusOrderByCreatedAtDesc(Long companyId, IncidentStatus status);

    long countByCompanyIdAndStatus(Long companyId, IncidentStatus status);
}
