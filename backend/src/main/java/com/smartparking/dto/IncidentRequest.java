package com.smartparking.dto;

import com.smartparking.enums.IncidentPriority;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentRequest {

    private Long slotId;
    private String vehicleNumber;

    @NotBlank(message = "Incident type is required")
    private String type;

    private IncidentPriority priority;

    @NotBlank(message = "Notes/description is required")
    private String notes;
}
