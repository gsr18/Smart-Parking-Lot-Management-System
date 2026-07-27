package com.smartparking.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartparking.dto.CheckInRequest;
import com.smartparking.dto.CheckOutRequest;
import com.smartparking.enums.VehicleType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ParkingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "staff", roles = {"STAFF"})
    @DisplayName("Should check-in vehicle, allocate slot, and return active session details")
    void testCheckIn_And_CheckOut_Workflow() throws Exception {
        CheckInRequest checkInRequest = CheckInRequest.builder()
                .vehicleNumber("TEST-9999")
                .vehicleType(VehicleType.CAR)
                .ownerName("Test Driver")
                .ownerContact("9998887776")
                .build();

        // 1. Perform Check-In
        mockMvc.perform(post("/api/v1/parking/checkin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(checkInRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.vehicleNumber").value("TEST-9999"))
                .andExpect(jsonPath("$.data.slotNumber").exists());

        // 2. Perform Check-Out
        CheckOutRequest checkOutRequest = CheckOutRequest.builder()
                .vehicleNumber("TEST-9999")
                .build();

        mockMvc.perform(post("/api/v1/parking/checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(checkOutRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.receiptNumber").exists())
                .andExpect(jsonPath("$.data.parkingFee").exists());
    }

    @Test
    @WithMockUser(username = "staff", roles = {"STAFF"})
    @DisplayName("Should return active parking sessions list")
    void testGetActiveSessions() throws Exception {
        mockMvc.perform(get("/api/v1/parking/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
