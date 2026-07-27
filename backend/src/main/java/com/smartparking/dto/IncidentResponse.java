package com.smartparking.dto;

import com.smartparking.enums.IncidentPriority;
import com.smartparking.enums.IncidentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentResponse {
    private Long id;
    private String incidentNumber;
    private String reportedByUsername;
    private String reportedByFullName;
    private String slotNumber;
    private String vehicleNumber;
    private String type;
    private IncidentPriority priority;
    private String notes;
    private IncidentStatus status;
    private String adminNotes;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
