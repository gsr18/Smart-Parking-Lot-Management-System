package com.smartparking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;

    @Builder.Default
    private String tokenType = "Bearer";

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private Set<String> roles;

    private Long companyId;
    private String companyName;
    private String companyCode;
}
