package com.smartparking.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "pending_registrations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(name = "otp_code", nullable = false, length = 10)
    private String otpCode;

    @Column(name = "user_type", nullable = false, length = 20)
    private String userType; // 'ADMIN' or 'STAFF'

    @Column(name = "company_name", length = 100)
    private String companyName;

    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, length = 50)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "approved_by_admin")
    @Builder.Default
    private Boolean approvedByAdmin = false;

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "PENDING"; // 'PENDING', 'APPROVED', 'REJECTED'

    @Column(name = "approval_token", length = 64)
    private String approvalToken;

    @Column(name = "rejection_reason", length = 255)
    private String rejectionReason;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
