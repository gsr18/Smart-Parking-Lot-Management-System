package com.smartparking.controller;

import com.smartparking.dto.ApiResponse;
import com.smartparking.dto.IncidentRequest;
import com.smartparking.dto.IncidentResponse;
import com.smartparking.service.IncidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    @PostMapping
    public ResponseEntity<ApiResponse<IncidentResponse>> reportIncident(@Valid @RequestBody IncidentRequest request) {
        IncidentResponse response = incidentService.reportIncident(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Incident reported successfully"));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<IncidentResponse>> resolveIncident(
            @PathVariable Long id,
            @RequestParam(required = false) String adminNotes) {
        IncidentResponse response = incidentService.resolveIncident(id, adminNotes);
        return ResponseEntity.ok(ApiResponse.success(response, "Incident resolved successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<IncidentResponse>>> getCompanyIncidents() {
        List<IncidentResponse> response = incidentService.getCompanyIncidents();
        return ResponseEntity.ok(ApiResponse.success(response, "Incidents fetched successfully"));
    }
}
