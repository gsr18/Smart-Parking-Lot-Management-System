package com.smartparking.service;

import com.smartparking.dto.*;
import com.smartparking.entity.Company;
import com.smartparking.entity.PendingRegistration;
import com.smartparking.entity.Role;
import com.smartparking.entity.User;
import com.smartparking.enums.RoleType;
import com.smartparking.exception.BadRequestException;
import com.smartparking.exception.ResourceNotFoundException;
import com.smartparking.repository.CompanyRepository;
import com.smartparking.repository.PendingRegistrationRepository;
import com.smartparking.repository.RoleRepository;
import com.smartparking.repository.UserRepository;
import com.smartparking.security.JwtTokenProvider;
import com.smartparking.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final RoleRepository roleRepository;
    private final PendingRegistrationRepository pendingRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;

    public AuthResponse login(LoginRequest loginRequest) {
        log.info("Attempting authentication for user: {}", loginRequest.getUsernameOrEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userPrincipal.getId()));

        if (!user.getEnabled()) {
            throw new BadRequestException("Account is not activated yet. Please complete OTP verification.");
        }

        Set<String> roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        log.info("Authentication successful for user: {}", userPrincipal.getUsername());

        return AuthResponse.builder()
                .accessToken(jwt)
                .tokenType("Bearer")
                .id(userPrincipal.getId())
                .username(userPrincipal.getUsername())
                .email(userPrincipal.getEmail())
                .fullName(userPrincipal.getFullName())
                .roles(roles)
                .companyId(user.getCompany() != null ? user.getCompany().getId() : null)
                .companyName(user.getCompany() != null ? user.getCompany().getName() : null)
                .companyCode(user.getCompany() != null ? user.getCompany().getCompanyCode() : null)
                .build();
    }

    public AuthResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UsernameNotFoundException("No authenticated user found in SecurityContext");
        }

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userPrincipal.getId()));

        Set<String> roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());

        return AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(roles)
                .companyId(user.getCompany() != null ? user.getCompany().getId() : null)
                .companyName(user.getCompany() != null ? user.getCompany().getName() : null)
                .companyCode(user.getCompany() != null ? user.getCompany().getCompanyCode() : null)
                .build();
    }

    // ------------------------------------------------------------------
    // ADMIN SIGNUP (Unique Company + Email OTP)
    // ------------------------------------------------------------------
    @Transactional
    public Map<String, String> initiateAdminSignup(AdminInitiateSignupRequest req) {
        if (companyRepository.existsByNameIgnoreCase(req.getCompanyName().trim())) {
            throw new BadRequestException("Company name '" + req.getCompanyName().trim() + "' is already registered. Company names must be unique.");
        }
        if (userRepository.existsByUsername(req.getUsername().trim())) {
            throw new BadRequestException("Username '" + req.getUsername().trim() + "' is already taken.");
        }
        if (userRepository.existsByEmail(req.getEmail().trim())) {
            throw new BadRequestException("Email '" + req.getEmail().trim() + "' is already registered.");
        }

        String otp = otpService.generate6DigitOtp();
        pendingRepository.deleteByEmail(req.getEmail().trim());

        PendingRegistration pending = PendingRegistration.builder()
                .email(req.getEmail().trim())
                .otpCode(otp)
                .userType("ADMIN")
                .companyName(req.getCompanyName().trim())
                .fullName(req.getFullName().trim())
                .username(req.getUsername().trim())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .approvedByAdmin(true)
                .build();

        pendingRepository.save(pending);
        otpService.sendOtpEmail(req.getEmail().trim(), otp, "Admin Registration & Unique Company Creation OTP");

        Map<String, String> resp = new HashMap<>();
        resp.put("message", "6-digit OTP code sent to " + req.getEmail().trim());
        resp.put("email", req.getEmail().trim());
        return resp;
    }

    @Transactional
    public AuthResponse verifyAdminOtp(OtpVerificationRequest req) {
        PendingRegistration pending = pendingRepository.findFirstByEmailAndOtpCodeOrderByCreatedAtDesc(
                req.getEmail().trim(), req.getOtpCode().trim()
        ).orElseThrow(() -> new BadRequestException("Invalid or expired 6-digit OTP code"));

        if (pending.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP code has expired. Please initiate registration again.");
        }

        // Create Unique Company
        String companyCode = "COMP-" + pending.getCompanyName().replaceAll("[^a-zA-Z0-9]", "").toUpperCase() + "-" + (1000 + new Random().nextInt(9000));
        Company company = Company.builder()
                .name(pending.getCompanyName())
                .companyCode(companyCode)
                .build();
        company = companyRepository.save(company);

        // Fetch Roles (Admin gets BOTH ROLE_ADMIN and ROLE_STAFF)
        Role adminRole = roleRepository.findByName(RoleType.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(Role.builder().name(RoleType.ROLE_ADMIN).build()));
        Role staffRole = roleRepository.findByName(RoleType.ROLE_STAFF)
                .orElseGet(() -> roleRepository.save(Role.builder().name(RoleType.ROLE_STAFF).build()));

        User adminUser = User.builder()
                .username(pending.getUsername())
                .email(pending.getEmail())
                .password(pending.getPasswordHash())
                .fullName(pending.getFullName())
                .enabled(true)
                .approvedByAdmin(true)
                .company(company)
                .roles(Set.of(adminRole, staffRole))
                .build();

        adminUser = userRepository.save(adminUser);
        pendingRepository.deleteByEmail(pending.getEmail());

        log.info("Admin user '{}' created successfully with company '{}'", adminUser.getUsername(), company.getName());
        return generateAuthResponse(adminUser);
    }

    // ------------------------------------------------------------------
    // STAFF SIGNUP (Existing Company Selection + Admin Approval + Staff OTP)
    // ------------------------------------------------------------------
    @Transactional
    public Map<String, String> requestStaffSignup(StaffRequestSignupRequest req) {
        Company company = companyRepository.findById(req.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID: " + req.getCompanyId()));

        if (userRepository.existsByUsername(req.getUsername().trim())) {
            throw new BadRequestException("Username '" + req.getUsername().trim() + "' is already taken.");
        }
        if (userRepository.existsByEmail(req.getEmail().trim())) {
            throw new BadRequestException("Email '" + req.getEmail().trim() + "' is already registered.");
        }

        String otp = otpService.generate6DigitOtp();
        String approvalToken = UUID.randomUUID().toString();
        pendingRepository.deleteByEmail(req.getEmail().trim());

        PendingRegistration pending = PendingRegistration.builder()
                .email(req.getEmail().trim())
                .otpCode(otp)
                .userType("STAFF")
                .companyId(company.getId())
                .companyName(company.getName())
                .fullName(req.getFullName().trim())
                .username(req.getUsername().trim())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .expiresAt(LocalDateTime.now().plusDays(1))
                .approvedByAdmin(false)
                .status("PENDING")
                .approvalToken(approvalToken)
                .build();

        pending = pendingRepository.save(pending);

        // Notify Admin of Company with direct Approve/Reject HTML links
        Long pendingId = pending.getId();
        userRepository.findAll().stream()
                .filter(u -> u.getCompany() != null && u.getCompany().getId().equals(company.getId()) &&
                        u.getRoles().stream().anyMatch(r -> r.getName() == RoleType.ROLE_ADMIN))
                .findFirst()
                .ifPresent(admin -> otpService.sendAdminNotificationEmail(
                        admin.getEmail(), req.getFullName(), req.getEmail(), company.getName(), pendingId, approvalToken
                ));

        Map<String, String> resp = new HashMap<>();
        resp.put("message", "Staff registration requested successfully. The Admin of " + company.getName() + " has been notified for approval.");
        resp.put("email", req.getEmail().trim());
        resp.put("companyName", company.getName());
        return resp;
    }

    @Transactional(readOnly = true)
    public List<PendingRegistration> getPendingStaffRequests(Long companyId) {
        return pendingRepository.findByCompanyIdAndApprovedByAdminFalse(companyId).stream()
                .filter(p -> !"REJECTED".equalsIgnoreCase(p.getStatus()))
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, String> approveStaffRequest(Long pendingId) {
        PendingRegistration pending = pendingRepository.findById(pendingId)
                .orElseThrow(() -> new ResourceNotFoundException("Pending registration request not found: " + pendingId));

        pending.setApprovedByAdmin(true);
        pending.setStatus("APPROVED");
        pendingRepository.save(pending);

        // Dispatch OTP to Staff
        otpService.sendOtpEmail(pending.getEmail(), pending.getOtpCode(), "Staff Account Verification OTP (Approved by Admin)");

        Map<String, String> resp = new HashMap<>();
        resp.put("message", "Staff request approved. Verification OTP sent to " + pending.getEmail());
        resp.put("otpCode", pending.getOtpCode()); // Included for quick dev testing convenience
        return resp;
    }

    @Transactional
    public String approveStaffRequestByToken(Long pendingId, String token) {
        PendingRegistration pending = pendingRepository.findById(pendingId)
                .orElseThrow(() -> new BadRequestException("Registration request not found or link has expired."));

        if (!token.equals(pending.getApprovalToken())) {
            throw new BadRequestException("Invalid approval security token.");
        }

        if (Boolean.TRUE.equals(pending.getApprovedByAdmin()) || "APPROVED".equalsIgnoreCase(pending.getStatus())) {
            return generateActionResponseHtml("Request Already Approved", "Staff registration request for <strong>" + pending.getFullName() + "</strong> has already been approved and verification OTP dispatched.", "#10b981");
        }

        pending.setApprovedByAdmin(true);
        pending.setStatus("APPROVED");
        pendingRepository.save(pending);

        otpService.sendOtpEmail(pending.getEmail(), pending.getOtpCode(), "Staff Account Verification OTP (Approved by Admin)");

        return generateActionResponseHtml("Staff Registration Approved! ✅", "Staff member <strong>" + pending.getFullName() + "</strong> (" + pending.getEmail() + ") has been approved.<br/><br/>A 6-digit OTP verification code has been dispatched to their email.", "#10b981");
    }

    @Transactional
    public Map<String, String> rejectStaffRequest(Long pendingId, String reason) {
        PendingRegistration pending = pendingRepository.findById(pendingId)
                .orElseThrow(() -> new ResourceNotFoundException("Pending registration request not found: " + pendingId));

        pending.setStatus("REJECTED");
        pending.setApprovedByAdmin(false);
        pending.setRejectionReason(reason != null ? reason : "Rejected by company administrator.");
        pendingRepository.save(pending);

        otpService.sendStaffRejectionEmail(pending.getEmail(), pending.getFullName(), pending.getCompanyName());

        Map<String, String> resp = new HashMap<>();
        resp.put("message", "Staff registration request rejected successfully.");
        return resp;
    }

    @Transactional
    public String rejectStaffRequestByToken(Long pendingId, String token) {
        PendingRegistration pending = pendingRepository.findById(pendingId)
                .orElseThrow(() -> new BadRequestException("Registration request not found or link has expired."));

        if (!token.equals(pending.getApprovalToken())) {
            throw new BadRequestException("Invalid rejection security token.");
        }

        pending.setStatus("REJECTED");
        pending.setApprovedByAdmin(false);
        pendingRepository.save(pending);

        otpService.sendStaffRejectionEmail(pending.getEmail(), pending.getFullName(), pending.getCompanyName());

        return generateActionResponseHtml("Staff Registration Rejected ✖", "Staff registration request for <strong>" + pending.getFullName() + "</strong> (" + pending.getEmail() + ") has been rejected.<br/><br/>A notification email has been sent to the staff member.", "#ef4444");
    }

    @Transactional(readOnly = true)
    public Map<String, String> getStaffSignupStatus(String email) {
        Map<String, String> resp = new HashMap<>();
        Optional<PendingRegistration> pendingOpt = pendingRepository.findFirstByEmailOrderByCreatedAtDesc(email.trim());

        if (pendingOpt.isEmpty()) {
            // Check if already fully registered user
            if (userRepository.existsByEmail(email.trim())) {
                resp.put("status", "COMPLETED");
                resp.put("message", "Account is active and verified.");
                return resp;
            }
            resp.put("status", "NOT_FOUND");
            resp.put("message", "No registration request found for this email.");
            return resp;
        }

        PendingRegistration pending = pendingOpt.get();
        resp.put("status", pending.getStatus() != null ? pending.getStatus() : (pending.getApprovedByAdmin() ? "APPROVED" : "PENDING"));
        resp.put("email", pending.getEmail());
        resp.put("fullName", pending.getFullName());
        resp.put("companyName", pending.getCompanyName());
        resp.put("rejectionReason", pending.getRejectionReason());
        return resp;
    }

    private String generateActionResponseHtml(String title, String message, String colorHex) {
        return "<!DOCTYPE html>" +
                "<html><head><title>" + title + "</title>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }" +
                ".card { background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 40px; text-align: center; max-width: 480px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }" +
                "h1 { color: " + colorHex + "; margin-bottom: 16px; font-size: 24px; }" +
                "p { color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 24px; }" +
                ".footer { font-size: 12px; color: #64748b; margin-top: 20px; border-top: 1px solid #334155; padding-top: 16px; }" +
                "</style></head><body>" +
                "<div class='card'>" +
                "<h1>" + title + "</h1>" +
                "<p>" + message + "</p>" +
                "<div class='footer'>SmartParking Enterprise Security System</div>" +
                "</div></body></html>";
    }

    @Transactional
    public AuthResponse verifyStaffOtp(OtpVerificationRequest req) {
        PendingRegistration pending = pendingRepository.findFirstByEmailAndOtpCodeOrderByCreatedAtDesc(
                req.getEmail().trim(), req.getOtpCode().trim()
        ).orElseThrow(() -> new BadRequestException("Invalid 6-digit OTP code or registration not found"));

        if (!pending.getApprovedByAdmin()) {
            throw new BadRequestException("Your registration request is still pending approval from your company Admin.");
        }

        Company company = companyRepository.findById(pending.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found: " + pending.getCompanyId()));

        // Staff receives ONLY ROLE_STAFF (Never ROLE_ADMIN)
        Role staffRole = roleRepository.findByName(RoleType.ROLE_STAFF)
                .orElseGet(() -> roleRepository.save(Role.builder().name(RoleType.ROLE_STAFF).build()));

        User staffUser = User.builder()
                .username(pending.getUsername())
                .email(pending.getEmail())
                .password(pending.getPasswordHash())
                .fullName(pending.getFullName())
                .enabled(true)
                .approvedByAdmin(true)
                .company(company)
                .roles(Set.of(staffRole)) // STRICTLY ROLE_STAFF ONLY
                .build();

        staffUser = userRepository.save(staffUser);
        pendingRepository.deleteByEmail(pending.getEmail());

        log.info("Staff user '{}' activated successfully for company '{}'", staffUser.getUsername(), company.getName());
        return generateAuthResponse(staffUser);
    }

    private AuthResponse generateAuthResponse(User user) {
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userPrincipal, null, userPrincipal.getAuthorities()
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        Set<String> roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());

        return AuthResponse.builder()
                .accessToken(jwt)
                .tokenType("Bearer")
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(roles)
                .companyId(user.getCompany() != null ? user.getCompany().getId() : null)
                .companyName(user.getCompany() != null ? user.getCompany().getName() : null)
                .companyCode(user.getCompany() != null ? user.getCompany().getCompanyCode() : null)
                .build();
    }
}
