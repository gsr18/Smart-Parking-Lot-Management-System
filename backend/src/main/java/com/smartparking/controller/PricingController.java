package com.smartparking.controller;

import com.smartparking.dto.ApiResponse;
import com.smartparking.dto.PricingPolicyDTO;
import com.smartparking.service.PricingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/pricing")
@RequiredArgsConstructor
public class PricingController {

    private final PricingService pricingService;

    @GetMapping
    public ResponseEntity<ApiResponse<PricingPolicyDTO>> getPolicy() {
        PricingPolicyDTO policy = pricingService.getCompanyPolicy();
        return ResponseEntity.ok(ApiResponse.success(policy, "Pricing policy fetched successfully"));
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PricingPolicyDTO>> updatePolicy(@RequestBody PricingPolicyDTO dto) {
        PricingPolicyDTO updated = pricingService.updateCompanyPolicy(dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Pricing policy updated successfully"));
    }
}
