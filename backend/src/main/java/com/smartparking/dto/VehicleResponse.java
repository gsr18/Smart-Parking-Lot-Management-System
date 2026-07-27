package com.smartparking.dto;

import com.smartparking.enums.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleResponse {

    private Long id;
    private String vehicleNumber;
    private VehicleType vehicleType;
    private String ownerName;
    private String ownerContact;
    private boolean currentlyParked;
    private String activeSlotNumber;
    private LocalDateTime createdAt;
}
