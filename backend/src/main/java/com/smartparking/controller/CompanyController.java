package com.smartparking.controller;

import com.smartparking.dto.ApiResponse;
import com.smartparking.dto.CompanyDTO;
import com.smartparking.dto.LayoutConfigDTO;
import com.smartparking.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
@Tag(name = "Company API", description = "Company Directory & Layout Configuration Endpoints")
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping("/public")
    @Operation(summary = "Get list of registered companies for staff selection")
    public ResponseEntity<ApiResponse<List<CompanyDTO>>> getPublicCompanies() {
        List<CompanyDTO> companies = companyService.getPublicCompanies();
        return ResponseEntity.ok(ApiResponse.success(companies, "Public company list fetched successfully"));
    }

    @GetMapping("/my-layout")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current company layout configuration")
    public ResponseEntity<ApiResponse<CompanyDTO>> getMyCompanyLayout() {
        CompanyDTO company = companyService.getMyCompanyLayout();
        return ResponseEntity.ok(ApiResponse.success(company, "Company layout fetched successfully"));
    }

    @PutMapping("/layout")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Apply a new floor layout configuration (Admin only). Deletes & recreates all slots.")
    public ResponseEntity<ApiResponse<CompanyDTO>> applyLayoutConfig(@RequestBody LayoutConfigDTO config) {
        CompanyDTO result = companyService.applyLayoutConfig(config);
        return ResponseEntity.ok(ApiResponse.success(result, "Layout configuration applied successfully. " + "Parking slots regenerated."));
    }
}
