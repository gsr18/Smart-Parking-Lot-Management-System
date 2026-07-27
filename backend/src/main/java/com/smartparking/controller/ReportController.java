package com.smartparking.controller;

import com.smartparking.dto.ApiResponse;
import com.smartparking.dto.ReportResponse;
import com.smartparking.dto.RevenueSummaryResponse;
import com.smartparking.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Tag(name = "Reporting & Analytics API", description = "Endpoints for generating Daily, Weekly, Monthly reports and Revenue summaries")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/daily")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Generate daily parking operations and revenue report")
    public ResponseEntity<ApiResponse<ReportResponse>> getDailyReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        ReportResponse report = reportService.generateDailyReport(date);
        return ResponseEntity.ok(ApiResponse.success(report, "Daily report generated successfully"));
    }

    @GetMapping("/weekly")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Generate weekly parking operations and revenue report")
    public ResponseEntity<ApiResponse<ReportResponse>> getWeeklyReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        ReportResponse report = reportService.generateWeeklyReport(date);
        return ResponseEntity.ok(ApiResponse.success(report, "Weekly report generated successfully"));
    }

    @GetMapping("/monthly")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Generate monthly parking operations and revenue report")
    public ResponseEntity<ApiResponse<ReportResponse>> getMonthlyReport(
            @RequestParam(defaultValue = "2026") int year,
            @RequestParam(defaultValue = "7") int month) {
        ReportResponse report = reportService.generateMonthlyReport(year, month);
        return ResponseEntity.ok(ApiResponse.success(report, "Monthly report generated successfully"));
    }

    @GetMapping("/revenue")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get aggregated revenue metrics (Today, Week, Month, Lifetime)")
    public ResponseEntity<ApiResponse<RevenueSummaryResponse>> getRevenueSummary() {
        RevenueSummaryResponse summary = reportService.getRevenueSummary();
        return ResponseEntity.ok(ApiResponse.success(summary, "Revenue summary retrieved successfully"));
    }
}
