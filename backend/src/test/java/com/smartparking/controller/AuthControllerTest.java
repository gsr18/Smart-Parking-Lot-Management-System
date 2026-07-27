package com.smartparking.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartparking.dto.AdminInitiateSignupRequest;
import com.smartparking.dto.LoginRequest;
import com.smartparking.entity.Role;
import com.smartparking.entity.User;
import com.smartparking.enums.RoleType;
import com.smartparking.repository.RoleRepository;
import com.smartparking.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Set;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("Should initiate admin signup successfully")
    void testInitiateAdminSignup() throws Exception {
        AdminInitiateSignupRequest req = new AdminInitiateSignupRequest(
                "Test Owner",
                "testowner@example.com",
                "testowner",
                "Password123",
                "Test Enterprise"
        );

        mockMvc.perform(post("/api/v1/auth/signup/admin/initiate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("testowner@example.com"));
    }

    @Test
    @DisplayName("Should authenticate registered user and return JWT access token")
    void testLogin_Success() throws Exception {
        Role adminRole = roleRepository.findByName(RoleType.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(Role.builder().name(RoleType.ROLE_ADMIN).build()));

        User user = User.builder()
                .username("testadmin")
                .email("testadmin@example.com")
                .password(passwordEncoder.encode("Password123"))
                .fullName("Test Admin")
                .enabled(true)
                .approvedByAdmin(true)
                .roles(Set.of(adminRole))
                .build();
        userRepository.save(user);

        LoginRequest loginRequest = LoginRequest.builder()
                .usernameOrEmail("testadmin")
                .password("Password123")
                .build();

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").exists())
                .andExpect(jsonPath("$.data.username").value("testadmin"));
    }

    @Test
    @DisplayName("Should return 401 Unauthorized for invalid credentials")
    void testLogin_Failure_InvalidPassword() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .usernameOrEmail("nonexistentuser")
                .password("wrongpassword")
                .build();

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }
}
