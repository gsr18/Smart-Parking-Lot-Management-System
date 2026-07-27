package com.smartparking.service;

import com.smartparking.dto.CheckInRequest;
import com.smartparking.dto.CheckInResponse;
import com.smartparking.entity.ParkingSession;
import com.smartparking.entity.ParkingSlot;
import com.smartparking.entity.Vehicle;
import com.smartparking.enums.ParkingStatus;
import com.smartparking.enums.SlotStatus;
import com.smartparking.enums.SlotType;
import com.smartparking.enums.VehicleType;
import com.smartparking.exception.ConflictException;
import com.smartparking.mapper.ParkingSessionMapper;
import com.smartparking.repository.ParkingSessionRepository;
import com.smartparking.repository.ParkingSlotRepository;
import com.smartparking.repository.ReceiptRepository;
import com.smartparking.repository.VehicleRepository;
import com.smartparking.strategy.ParkingAllocationStrategy;
import com.smartparking.util.FeeCalculator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ParkingServiceTest {

    @Mock
    private ParkingSessionRepository sessionRepository;
    @Mock
    private ParkingSlotRepository slotRepository;
    @Mock
    private VehicleRepository vehicleRepository;
    @Mock
    private ReceiptRepository receiptRepository;
    @Mock
    private ParkingAllocationStrategy allocationStrategy;
    @Mock
    private FeeCalculator feeCalculator;
    @Mock
    private ParkingSessionMapper sessionMapper;

    @InjectMocks
    private ParkingService parkingService;

    private Vehicle sampleVehicle;
    private ParkingSlot sampleSlot;
    private CheckInRequest checkInRequest;

    @BeforeEach
    void setUp() {
        sampleVehicle = Vehicle.builder()
                .id(1L)
                .vehicleNumber("PB10AB1234")
                .vehicleType(VehicleType.CAR)
                .ownerName("Rahul Sharma")
                .ownerContact("9876543210")
                .build();

        sampleSlot = ParkingSlot.builder()
                .id(10L)
                .slotNumber("A-101")
                .slotType(SlotType.CAR)
                .floorNumber(1)
                .status(SlotStatus.AVAILABLE)
                .build();

        checkInRequest = CheckInRequest.builder()
                .vehicleNumber("PB10AB1234")
                .vehicleType(VehicleType.CAR)
                .ownerName("Rahul Sharma")
                .ownerContact("9876543210")
                .build();
    }

    @Test
    @DisplayName("Should successfully check-in vehicle and reserve allocated slot")
    void testCheckIn_Success() {
        when(sessionRepository.existsByVehicleVehicleNumberAndStatus("PB10AB1234", ParkingStatus.ACTIVE))
                .thenReturn(false);
        when(vehicleRepository.findByVehicleNumber("PB10AB1234"))
                .thenReturn(Optional.of(sampleVehicle));
        when(allocationStrategy.allocateSlot(SlotType.CAR))
                .thenReturn(Optional.of(sampleSlot));
        when(sessionRepository.save(any(ParkingSession.class))).thenAnswer(invocation -> {
            ParkingSession s = invocation.getArgument(0);
            s.setId(100L);
            return s;
        });
        when(sessionMapper.toCheckInResponse(any(ParkingSession.class))).thenReturn(
                CheckInResponse.builder()
                        .sessionId(100L)
                        .vehicleNumber("PB10AB1234")
                        .slotNumber("A-101")
                        .floorNumber(1)
                        .status("ACTIVE")
                        .build()
        );

        CheckInResponse response = parkingService.checkIn(checkInRequest);

        assertNotNull(response);
        assertEquals("PB10AB1234", response.getVehicleNumber());
        assertEquals("A-101", response.getSlotNumber());
        assertEquals(SlotStatus.OCCUPIED, sampleSlot.getStatus());
        verify(slotRepository, times(1)).save(sampleSlot);
    }

    @Test
    @DisplayName("Should throw ConflictException if vehicle is already parked in active session")
    void testCheckIn_AlreadyParked() {
        when(sessionRepository.existsByVehicleVehicleNumberAndStatus("PB10AB1234", ParkingStatus.ACTIVE))
                .thenReturn(true);

        assertThrows(ConflictException.class, () -> parkingService.checkIn(checkInRequest));
        verify(slotRepository, never()).save(any());
    }
}
