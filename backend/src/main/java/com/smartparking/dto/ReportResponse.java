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
public class ReportResponse {

    private String reportPeriod; // e.g., "Daily", "Weekly", "Monthly"
    private String startDate;
    private String endDate;
    private long totalParkedVehicles;
    private long totalExitedVehicles;
    private BigDecimal totalRevenue;
    private BigDecimal carRevenue;
    private BigDecimal bikeRevenue;
    private BigDecimal truckRevenue;
    private double averageDurationMinutes;
    private VehicleDistributionResponse vehicleDistribution;
}
