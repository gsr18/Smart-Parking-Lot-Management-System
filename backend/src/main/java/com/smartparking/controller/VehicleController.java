package com.smartparking.controller;

import com.smartparking.dto.ApiResponse;
import com.smartparking.dto.VehicleRequest;
import com.smartparking.dto.VehicleResponse;
import com.smartparking.service.VehicleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
@Tag(name = "Vehicle Management API", description = "Endpoints for vehicle registration, search, and details")
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Register a new vehicle")
    public ResponseEntity<ApiResponse<VehicleResponse>> registerVehicle(@Valid @RequestBody VehicleRequest request) {
        VehicleResponse response = vehicleService.registerVehicle(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Vehicle registered successfully"));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get paginated list of all registered vehicles")
    public ResponseEntity<ApiResponse<Page<VehicleResponse>>> getAllVehicles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<VehicleResponse> vehicles = vehicleService.getAllVehicles(pageable);
        return ResponseEntity.ok(ApiResponse.success(vehicles, "Vehicles retrieved successfully"));
    }

    @GetMapping("/{vehicleNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get vehicle details by vehicle registration number")
    public ResponseEntity<ApiResponse<VehicleResponse>> getVehicleByNumber(@PathVariable String vehicleNumber) {
        VehicleResponse response = vehicleService.getVehicleByNumber(vehicleNumber);
        return ResponseEntity.ok(ApiResponse.success(response, "Vehicle details retrieved successfully"));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Search vehicles by vehicle number, owner name, or contact number")
    public ResponseEntity<ApiResponse<Page<VehicleResponse>>> searchVehicles(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("vehicleNumber").ascending());
        Page<VehicleResponse> results = vehicleService.searchVehicles(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success(results, "Vehicle search results retrieved successfully"));
    }
}
