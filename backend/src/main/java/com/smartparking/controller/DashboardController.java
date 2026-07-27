package com.smartparking.controller;

import com.smartparking.dto.ApiResponse;
import com.smartparking.dto.DashboardSummaryResponse;
import com.smartparking.dto.RecentActivityResponse;
import com.smartparking.dto.VehicleDistributionResponse;
import com.smartparking.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard API", description = "Endpoints for live dashboard metrics, occupancy statistics, and activity")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get comprehensive real-time dashboard metrics and revenue statistics")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getDashboardSummary() {
        DashboardSummaryResponse summary = dashboardService.getDashboardSummary();
        return ResponseEntity.ok(ApiResponse.success(summary, "Dashboard metrics retrieved successfully"));
    }

    @GetMapping("/recent-activity")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get the 10 most recent parking activity events")
    public ResponseEntity<ApiResponse<List<RecentActivityResponse>>> getRecentActivities() {
        List<RecentActivityResponse> activities = dashboardService.getRecentActivities();
        return ResponseEntity.ok(ApiResponse.success(activities, "Recent parking activity retrieved successfully"));
    }

    @GetMapping("/vehicle-distribution")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get vehicle type distribution percentages and counts (Cars, Bikes, Trucks)")
    public ResponseEntity<ApiResponse<VehicleDistributionResponse>> getVehicleDistribution() {
        VehicleDistributionResponse distribution = dashboardService.getVehicleDistribution();
        return ResponseEntity.ok(ApiResponse.success(distribution, "Vehicle distribution statistics retrieved successfully"));
    }
}
