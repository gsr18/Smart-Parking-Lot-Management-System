package com.smartparking.controller;

import com.smartparking.dto.ApiResponse;
import com.smartparking.dto.ShiftRequest;
import com.smartparking.dto.ShiftResponse;
import com.smartparking.service.ShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shifts")
@RequiredArgsConstructor
public class ShiftController {

    private final ShiftService shiftService;

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<ShiftResponse>> startShift(@RequestBody(required = false) ShiftRequest request) {
        ShiftResponse response = shiftService.startShift(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Shift started successfully"));
    }

    @PostMapping("/end")
    public ResponseEntity<ApiResponse<ShiftResponse>> endShift(@RequestBody(required = false) ShiftRequest request) {
        ShiftResponse response = shiftService.endShift(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Shift ended successfully"));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<ShiftResponse>> getActiveShift() {
        ShiftResponse response = shiftService.getActiveShift();
        return ResponseEntity.ok(ApiResponse.success(response, "Active shift fetched"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShiftResponse>>> getCompanyShifts() {
        List<ShiftResponse> response = shiftService.getCompanyShifts();
        return ResponseEntity.ok(ApiResponse.success(response, "Company shifts fetched"));
    }
}
