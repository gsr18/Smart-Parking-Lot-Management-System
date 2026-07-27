package com.smartparking.controller;

import com.smartparking.dto.*;
import com.smartparking.enums.VehicleType;
import com.smartparking.service.AiAssistantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(name = "Spring AI Assistant API", description = "Endpoints for natural language queries, smart slot recommendations, and report insights")
public class AiController {

    private final AiAssistantService aiAssistantService;

    @PostMapping("/chat")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Ask natural language questions about occupancy, revenue, or parking operations")
    public ResponseEntity<ApiResponse<AiChatResponse>> chatQuery(@Valid @RequestBody AiChatRequest request) {
        AiChatResponse response = aiAssistantService.processChatQuery(request);
        return ResponseEntity.ok(ApiResponse.success(response, "AI query processed successfully"));
    }

    @GetMapping("/recommend-slot")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get AI smart slot recommendation based on vehicle type and floor occupancy")
    public ResponseEntity<ApiResponse<SlotRecommendationResponse>> recommendSlot(
            @RequestParam(defaultValue = "CAR") VehicleType vehicleType) {
        SlotRecommendationResponse response = aiAssistantService.recommendSlot(vehicleType);
        return ResponseEntity.ok(ApiResponse.success(response, "AI slot recommendation generated successfully"));
    }

    @PostMapping("/explain-report")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Generate AI natural language analytical summary and insights for a report")
    public ResponseEntity<ApiResponse<String>> explainReport(@RequestBody ReportResponse report) {
        String explanation = aiAssistantService.explainReport(report);
        return ResponseEntity.ok(ApiResponse.success(explanation, "AI report explanation generated successfully"));
    }
}
