package com.smartparking.dto;

import com.smartparking.enums.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckOutResponse {

    private Long sessionId;
    private String receiptNumber;
    private String vehicleNumber;
    private VehicleType vehicleType;
    private String ownerName;
    private String slotNumber;
    private Integer floorNumber;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private BigDecimal parkingFee;
    private Long staffId;
    private String staffName;
    private String status;
}
