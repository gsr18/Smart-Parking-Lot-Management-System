package com.smartparking.service;

import com.smartparking.dto.AuditLogDTO;
import com.smartparking.entity.AdminAuditLog;
import com.smartparking.entity.Company;
import com.smartparking.entity.User;
import com.smartparking.repository.AdminAuditLogRepository;
import com.smartparking.repository.UserRepository;
import com.smartparking.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AdminAuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        if (!(auth.getPrincipal() instanceof UserPrincipal)) {
            return null;
        }
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        return userRepository.findById(userPrincipal.getId()).orElse(null);
    }

    @Transactional
    public void logAction(String actionType, String entityName, Long entityId, String reason) {
        User admin = getCurrentUser();
        if (admin == null) return;

        Company company = admin.getCompany();
        AdminAuditLog logEntry = AdminAuditLog.builder()
                .company(company)
                .adminUser(admin)
                .actionType(actionType)
                .entityName(entityName)
                .entityId(entityId)
                .reason(reason != null ? reason : "Administrative Override")
                .build();

        auditLogRepository.save(logEntry);
        log.info("Audit Log Entry created: Admin {} performed {} on {} ID: {}", admin.getUsername(), actionType, entityName, entityId);
    }

    @Transactional(readOnly = true)
    public List<AuditLogDTO> getCompanyAuditLogs() {
        User user = getCurrentUser();
        Long companyId = user != null && user.getCompany() != null ? user.getCompany().getId() : 1L;

        return auditLogRepository.findByCompanyIdOrderByTimestampDesc(companyId).stream()
                .map(log -> AuditLogDTO.builder()
                        .id(log.getId())
                        .adminUsername(log.getAdminUser().getUsername())
                        .adminFullName(log.getAdminUser().getFullName())
                        .actionType(log.getActionType())
                        .entityName(log.getEntityName())
                        .entityId(log.getEntityId())
                        .reason(log.getReason())
                        .timestamp(log.getTimestamp())
                        .build())
                .collect(Collectors.toList());
    }
}
