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
public class RevenueSummaryResponse {

    private BigDecimal revenueToday;
    private BigDecimal revenueThisWeek;
    private BigDecimal revenueThisMonth;
    private BigDecimal lifetimeRevenue;
}
