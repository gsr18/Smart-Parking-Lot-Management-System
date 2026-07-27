package com.smartparking.controller;

import com.smartparking.dto.ApiResponse;
import com.smartparking.dto.SlotRequest;
import com.smartparking.dto.SlotResponse;
import com.smartparking.enums.SlotType;
import com.smartparking.service.SlotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/slots")
@RequiredArgsConstructor
@Tag(name = "Parking Slot Management API", description = "Endpoints for creating, updating, enabling, disabling, and viewing slots")
public class SlotController {

    private final SlotService slotService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new parking slot (Admin only)")
    public ResponseEntity<ApiResponse<SlotResponse>> createSlot(@Valid @RequestBody SlotRequest request) {
        SlotResponse response = slotService.createSlot(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Parking slot created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing parking slot (Admin only)")
    public ResponseEntity<ApiResponse<SlotResponse>> updateSlot(@PathVariable Long id, @Valid @RequestBody SlotRequest request) {
        SlotResponse response = slotService.updateSlot(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Parking slot updated successfully"));
    }

    @PatchMapping("/{id}/disable")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Disable a parking slot (Admin only)")
    public ResponseEntity<ApiResponse<SlotResponse>> disableSlot(@PathVariable Long id) {
        SlotResponse response = slotService.disableSlot(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Parking slot disabled successfully"));
    }

    @PatchMapping("/{id}/enable")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Enable a parking slot (Admin only)")
    public ResponseEntity<ApiResponse<SlotResponse>> enableSlot(@PathVariable Long id) {
        SlotResponse response = slotService.enableSlot(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Parking slot enabled successfully"));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get all parking slots")
    public ResponseEntity<ApiResponse<List<SlotResponse>>> getAllSlots() {
        List<SlotResponse> slots = slotService.getAllSlots();
        return ResponseEntity.ok(ApiResponse.success(slots, "All parking slots retrieved successfully"));
    }

    @GetMapping("/available")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get available parking slots, optionally filtered by vehicle slot type")
    public ResponseEntity<ApiResponse<List<SlotResponse>>> getAvailableSlots(
            @RequestParam(required = false) SlotType slotType) {
        List<SlotResponse> slots = slotService.getAvailableSlots(slotType);
        return ResponseEntity.ok(ApiResponse.success(slots, "Available parking slots retrieved successfully"));
    }

    @GetMapping("/floor/{floorNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get parking slots by floor number")
    public ResponseEntity<ApiResponse<List<SlotResponse>>> getSlotsByFloor(@PathVariable Integer floorNumber) {
        List<SlotResponse> slots = slotService.getSlotsByFloor(floorNumber);
        return ResponseEntity.ok(ApiResponse.success(slots, "Floor parking slots retrieved successfully"));
    }

    @GetMapping("/floors")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get list of all distinct parking floor numbers")
    public ResponseEntity<ApiResponse<List<Integer>>> getFloorNumbers() {
        List<Integer> floors = slotService.getFloorNumbers();
        return ResponseEntity.ok(ApiResponse.success(floors, "Distinct floor numbers retrieved successfully"));
    }
}
