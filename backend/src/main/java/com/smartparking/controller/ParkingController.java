package com.smartparking.controller;

import com.smartparking.dto.*;
import com.smartparking.enums.ParkingStatus;
import com.smartparking.service.ParkingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/parking")
@RequiredArgsConstructor
@Tag(name = "Parking Operations API", description = "Endpoints for vehicle check-in, check-out, active sessions, and parking history")
public class ParkingController {

    private final ParkingService parkingService;

    @PostMapping("/checkin")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Check-in a vehicle into the parking lot")
    public ResponseEntity<ApiResponse<CheckInResponse>> checkIn(@Valid @RequestBody CheckInRequest request) {
        CheckInResponse response = parkingService.checkIn(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Vehicle checked in successfully"));
    }

    @PostMapping("/checkout")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Check-out a vehicle from the parking lot, calculate fee, and generate receipt")
    public ResponseEntity<ApiResponse<CheckOutResponse>> checkOut(@Valid @RequestBody CheckOutRequest request) {
        CheckOutResponse response = parkingService.checkOut(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Vehicle checked out successfully"));
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get paginated active parking sessions")
    public ResponseEntity<ApiResponse<Page<CheckInResponse>>> getActiveSessions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("entryTime").descending());
        Page<CheckInResponse> sessions = parkingService.getActiveSessions(pageable);
        return ResponseEntity.ok(ApiResponse.success(sessions, "Active parking sessions retrieved successfully"));
    }

    @GetMapping("/history")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get paginated parking history with filtering by vehicle number, status, and date range")
    public ResponseEntity<ApiResponse<Page<CheckOutResponse>>> getParkingHistory(
            @RequestParam(required = false) String vehicleNumber,
            @RequestParam(required = false) ParkingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "entryTime") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<CheckOutResponse> history = parkingService.getParkingHistory(vehicleNumber, status, startDate, endDate, pageable);
        return ResponseEntity.ok(ApiResponse.success(history, "Parking history retrieved successfully"));
    }

    @GetMapping("/session/{sessionId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get parking session details by session ID")
    public ResponseEntity<ApiResponse<CheckOutResponse>> getSessionDetails(@PathVariable Long sessionId) {
        CheckOutResponse response = parkingService.getSessionDetails(sessionId);
        return ResponseEntity.ok(ApiResponse.success(response, "Parking session details retrieved successfully"));
    }
}
