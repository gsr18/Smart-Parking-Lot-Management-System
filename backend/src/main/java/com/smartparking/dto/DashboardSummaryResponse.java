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
public class DashboardSummaryResponse {

    private long totalSlots;
    private long availableSlots;
    private long occupiedSlots;
    private long disabledSlots;
    private double occupancyPercentage;
    private long activeSessions;
    private long vehiclesParkedToday;
    private long vehiclesExitedToday;
    private BigDecimal revenueToday;
    private BigDecimal revenueThisWeek;
    private BigDecimal revenueThisMonth;
    private BigDecimal lifetimeRevenue;
}
