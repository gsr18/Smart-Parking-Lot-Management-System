package com.smartparking;

import com.smartparking.repository.ParkingSlotRepository;
import com.smartparking.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
class SmartParkingApplicationTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ParkingSlotRepository parkingSlotRepository;

    @Test
    @DisplayName("Verify Spring Boot application context loads cleanly and Flyway seed data initializes")
    void contextLoads() {
        assertNotNull(userRepository);
        assertNotNull(parkingSlotRepository);

        // Verify Flyway seed parking slots loaded correctly
        assertTrue(parkingSlotRepository.count() > 0, "Parking slots from Flyway seed migration V2 should be loaded");
    }
}
