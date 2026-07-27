package com.smartparking.controller;

import com.smartparking.dto.ApiResponse;
import com.smartparking.dto.AuditLogDTO;
import com.smartparking.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AuditLogDTO>>> getAuditLogs() {
        List<AuditLogDTO> logs = auditLogService.getCompanyAuditLogs();
        return ResponseEntity.ok(ApiResponse.success(logs, "Audit logs fetched successfully"));
    }
}
