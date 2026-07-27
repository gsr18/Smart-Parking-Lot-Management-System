package com.smartparking.repository;

import com.smartparking.entity.AdminAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminAuditLogRepository extends JpaRepository<AdminAuditLog, Long> {

    List<AdminAuditLog> findByCompanyIdOrderByTimestampDesc(Long companyId);
}
