package com.smartparking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogDTO {
    private Long id;
    private String adminUsername;
    private String adminFullName;
    private String actionType;
    private String entityName;
    private Long entityId;
    private String reason;
    private LocalDateTime timestamp;
}
