package com.smartparking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDistributionResponse {

    private long totalCars;
    private long totalBikes;
    private long totalTrucks;
    private double carPercentage;
    private double bikePercentage;
    private double truckPercentage;
}
