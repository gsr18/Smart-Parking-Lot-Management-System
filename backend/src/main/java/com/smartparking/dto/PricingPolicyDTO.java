package com.smartparking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PricingPolicyDTO {
    private BigDecimal carHourlyRate;
    private BigDecimal bikeHourlyRate;
    private BigDecimal truckHourlyRate;
    private BigDecimal peakMultiplier;
    private BigDecimal weekendMultiplier;
    private BigDecimal lostTicketFee;
    private Integer peakStartHour;
    private Integer peakEndHour;
}
