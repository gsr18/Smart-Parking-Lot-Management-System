package com.smartparking.repository;

import com.smartparking.entity.PendingRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PendingRegistrationRepository extends JpaRepository<PendingRegistration, Long> {

    Optional<PendingRegistration> findFirstByEmailOrderByCreatedAtDesc(String email);

    Optional<PendingRegistration> findFirstByEmailAndOtpCodeOrderByCreatedAtDesc(String email, String otpCode);

    List<PendingRegistration> findByCompanyIdAndApprovedByAdminFalse(Long companyId);

    Optional<PendingRegistration> findByApprovalToken(String approvalToken);

    List<PendingRegistration> findByCompanyIdAndStatus(Long companyId, String status);

    void deleteByEmail(String email);
}
