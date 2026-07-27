package com.smartparking.dto;

import com.smartparking.enums.SlotStatus;
import com.smartparking.enums.SlotType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SlotResponse {

    private Long id;
    private String slotNumber;
    private SlotType slotType;
    private Integer floorNumber;
    private SlotStatus status;
    private String occupiedByVehicleNumber;
    private String currentOwnerName;
}
