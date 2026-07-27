package com.smartparking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckOutRequest {

    private String vehicleNumber;
    private String slotNumber;
    
    @Builder.Default
    private String paymentMethod = "CASH";
}
