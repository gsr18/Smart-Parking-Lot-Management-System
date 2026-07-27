package com.smartparking.dto;

import com.smartparking.enums.ParkingStatus;
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
public class RecentActivityResponse {

    private Long sessionId;
    private String vehicleNumber;
    private VehicleType vehicleType;
    private String slotNumber;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private ParkingStatus status;
}
