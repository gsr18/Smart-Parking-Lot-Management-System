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
public class CheckInResponse {

    private Long sessionId;
    private String vehicleNumber;
    private VehicleType vehicleType;
    private String ownerName;
    private String slotNumber;
    private Integer floorNumber;
    private Long staffId;
    private String staffName;
    private String status;
}
