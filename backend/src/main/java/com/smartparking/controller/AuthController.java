package com.smartparking.controller;

import com.smartparking.dto.*;
import com.smartparking.entity.PendingRegistration;
import com.smartparking.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication API", description = "Endpoints for Multi-Tenant Auth, Signup, OTP, and User Profile")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and return JWT access token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success(authResponse, "Authentication successful"));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile details")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser() {
        AuthResponse userResponse = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(userResponse, "Current user profile fetched successfully"));
    }

    // ------------------------------------------------------------------
    // ADMIN SIGNUP & OTP VERIFICATION
    // ------------------------------------------------------------------
    @PostMapping("/signup/admin/initiate")
    @Operation(summary = "Initiate Admin Registration & Company Creation (Generates 6-Digit OTP)")
    public ResponseEntity<ApiResponse<Map<String, String>>> initiateAdminSignup(@Valid @RequestBody AdminInitiateSignupRequest request) {
        Map<String, String> result = authService.initiateAdminSignup(request);
        return ResponseEntity.ok(ApiResponse.success(result, "OTP code sent to admin email"));
    }

    @PostMapping("/signup/admin/verify")
    @Operation(summary = "Verify Admin 6-Digit OTP and Complete Company & Admin Creation")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyAdminOtp(@Valid @RequestBody OtpVerificationRequest request) {
        AuthResponse response = authService.verifyAdminOtp(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Admin registration & company creation completed successfully"));
    }

    // ------------------------------------------------------------------
    // STAFF SIGNUP, ADMIN APPROVAL & OTP VERIFICATION
    // ------------------------------------------------------------------
    @PostMapping("/signup/staff/request")
    @Operation(summary = "Staff Request Registration for Existing Company (Requires Admin Approval)")
    public ResponseEntity<ApiResponse<Map<String, String>>> requestStaffSignup(@Valid @RequestBody StaffRequestSignupRequest request) {
        Map<String, String> result = authService.requestStaffSignup(request);
        return ResponseEntity.ok(ApiResponse.success(result, "Staff registration request submitted to company admin"));
    }

    @GetMapping("/pending-staff/{companyId}")
    @Operation(summary = "Get list of pending staff requests for a company (Admin only)")
    public ResponseEntity<ApiResponse<List<PendingRegistration>>> getPendingStaffRequests(@PathVariable Long companyId) {
        List<PendingRegistration> requests = authService.getPendingStaffRequests(companyId);
        return ResponseEntity.ok(ApiResponse.success(requests, "Pending staff requests fetched successfully"));
    }

    @PostMapping("/signup/staff/approve/{pendingId}")
    @Operation(summary = "Approve pending staff registration request (Dispatches 6-Digit OTP to Staff)")
    public ResponseEntity<ApiResponse<Map<String, String>>> approveStaffRequest(@PathVariable Long pendingId) {
        Map<String, String> result = authService.approveStaffRequest(pendingId);
        return ResponseEntity.ok(ApiResponse.success(result, "Staff request approved & OTP dispatched"));
    }

    @PostMapping("/signup/staff/reject/{pendingId}")
    @Operation(summary = "Reject pending staff registration request")
    public ResponseEntity<ApiResponse<Map<String, String>>> rejectStaffRequest(@PathVariable Long pendingId, @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : null;
        Map<String, String> result = authService.rejectStaffRequest(pendingId, reason);
        return ResponseEntity.ok(ApiResponse.success(result, "Staff request rejected"));
    }

    @GetMapping(value = "/signup/staff/approve-direct", produces = MediaType.TEXT_HTML_VALUE)
    @Operation(summary = "Direct Email Action: Approve Staff Request")
    public ResponseEntity<String> approveStaffRequestDirect(@RequestParam Long id, @RequestParam String token) {
        String htmlResponse = authService.approveStaffRequestByToken(id, token);
        return ResponseEntity.ok(htmlResponse);
    }

    @GetMapping(value = "/signup/staff/reject-direct", produces = MediaType.TEXT_HTML_VALUE)
    @Operation(summary = "Direct Email Action: Reject Staff Request")
    public ResponseEntity<String> rejectStaffRequestDirect(@RequestParam Long id, @RequestParam String token) {
        String htmlResponse = authService.rejectStaffRequestByToken(id, token);
        return ResponseEntity.ok(htmlResponse);
    }

    @GetMapping("/signup/staff/status")
    @Operation(summary = "Check Staff Registration Status by Email")
    public ResponseEntity<ApiResponse<Map<String, String>>> getStaffSignupStatus(@RequestParam String email) {
        Map<String, String> result = authService.getStaffSignupStatus(email);
        return ResponseEntity.ok(ApiResponse.success(result, "Staff signup status fetched successfully"));
    }

    @PostMapping("/signup/staff/verify")
    @Operation(summary = "Verify Staff 6-Digit OTP and Activate Staff Account")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyStaffOtp(@Valid @RequestBody OtpVerificationRequest request) {
        AuthResponse response = authService.verifyStaffOtp(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Staff registration completed successfully"));
    }
}
