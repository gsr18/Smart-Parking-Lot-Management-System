package com.smartparking.service;

import com.smartparking.dto.*;
import com.smartparking.entity.Company;
import com.smartparking.entity.ParkingSession;
import com.smartparking.entity.ParkingSlot;
import com.smartparking.entity.Receipt;
import com.smartparking.entity.User;
import com.smartparking.entity.Vehicle;
import com.smartparking.enums.ParkingStatus;
import com.smartparking.enums.RoleType;
import com.smartparking.enums.SlotStatus;
import com.smartparking.enums.SlotType;
import com.smartparking.exception.BadRequestException;
import com.smartparking.exception.ConflictException;
import com.smartparking.exception.InvalidOperationException;
import com.smartparking.exception.ResourceNotFoundException;
import com.smartparking.exception.SlotUnavailableException;
import com.smartparking.mapper.ParkingSessionMapper;
import com.smartparking.repository.ParkingSessionRepository;
import com.smartparking.repository.ParkingSlotRepository;
import com.smartparking.repository.ReceiptRepository;
import com.smartparking.repository.UserRepository;
import com.smartparking.repository.VehicleRepository;
import com.smartparking.security.UserPrincipal;
import com.smartparking.strategy.ParkingAllocationStrategy;
import com.smartparking.util.FeeCalculator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ParkingService {

    private final ParkingSessionRepository sessionRepository;
    private final ParkingSlotRepository slotRepository;
    private final VehicleRepository vehicleRepository;
    private final ReceiptRepository receiptRepository;
    private final UserRepository userRepository;
    private final ParkingAllocationStrategy allocationStrategy;
    private final FeeCalculator feeCalculator;
    private final ParkingSessionMapper sessionMapper;
    private final ShiftService shiftService;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        if (!(auth.getPrincipal() instanceof UserPrincipal)) {
            return null;
        }
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        return userRepository.findById(userPrincipal.getId()).orElse(null);
    }

    @Transactional
    public CheckInResponse checkIn(CheckInRequest request) {
        log.info("Processing check-in request for vehicle: {}", request.getVehicleNumber());
        User currentUser = getCurrentUser();
        Company company = currentUser != null ? currentUser.getCompany() : null;
        Long companyId = company != null ? company.getId() : null;

        // 1. Business Rule: Check if vehicle already has an active session
        boolean hasActiveSession = (companyId != null) ?
                sessionRepository.existsByVehicleVehicleNumberAndStatusAndCompanyId(request.getVehicleNumber(), ParkingStatus.ACTIVE, companyId) :
                sessionRepository.existsByVehicleVehicleNumberAndStatus(request.getVehicleNumber(), ParkingStatus.ACTIVE);

        if (hasActiveSession) {
            throw new ConflictException("Vehicle '" + request.getVehicleNumber() + "' already has an ACTIVE parking session");
        }

        // 2. Fetch or Register Vehicle
        Optional<Vehicle> existingVehicle = (companyId != null) ?
                vehicleRepository.findByVehicleNumberAndCompanyId(request.getVehicleNumber(), companyId) :
                vehicleRepository.findByVehicleNumber(request.getVehicleNumber());

        Vehicle vehicle = existingVehicle.orElseGet(() -> vehicleRepository.save(Vehicle.builder()
                .vehicleNumber(request.getVehicleNumber())
                .vehicleType(request.getVehicleType())
                .ownerName(request.getOwnerName())
                .ownerContact(request.getOwnerContact())
                .company(company)
                .build()));

        // Update vehicle owner info if changed
        vehicle.setOwnerName(request.getOwnerName());
        vehicle.setOwnerContact(request.getOwnerContact());
        vehicleRepository.save(vehicle);

        // 3. Slot Allocation (Manual override or Strategy pattern)
        SlotType requiredSlotType = SlotType.valueOf(request.getVehicleType().name());
        ParkingSlot allocatedSlot;

        if (request.getPreferredSlotNumber() != null && !request.getPreferredSlotNumber().isBlank()) {
            Optional<ParkingSlot> prefSlotOpt = (companyId != null) ?
                    slotRepository.findBySlotNumberAndCompanyId(request.getPreferredSlotNumber(), companyId) :
                    slotRepository.findBySlotNumber(request.getPreferredSlotNumber());

            allocatedSlot = prefSlotOpt.orElseThrow(() -> new ResourceNotFoundException("ParkingSlot", "slotNumber", request.getPreferredSlotNumber()));

            if (allocatedSlot.getStatus() != SlotStatus.AVAILABLE) {
                throw new SlotUnavailableException("Slot '" + request.getPreferredSlotNumber() + "' is not AVAILABLE");
            }
            if (allocatedSlot.getSlotType() != requiredSlotType) {
                throw new InvalidOperationException("Slot '" + request.getPreferredSlotNumber() + "' (" + allocatedSlot.getSlotType() +
                        ") is incompatible with vehicle type " + request.getVehicleType());
            }
        } else {
            Optional<ParkingSlot> stratSlotOpt = (companyId != null) ?
                    allocationStrategy.allocateSlot(requiredSlotType, companyId) :
                    allocationStrategy.allocateSlot(requiredSlotType);

            allocatedSlot = stratSlotOpt.orElseThrow(() -> new SlotUnavailableException("No compatible AVAILABLE parking slot found for vehicle type: " + request.getVehicleType()));
        }

        // 4. Reserve Slot and Create Active Parking Session
        allocatedSlot.setStatus(SlotStatus.OCCUPIED);
        slotRepository.save(allocatedSlot);

        ParkingSession session = ParkingSession.builder()
                .vehicle(vehicle)
                .parkingSlot(allocatedSlot)
                .ownerName(request.getOwnerName())
                .ownerContact(request.getOwnerContact())
                .entryTime(LocalDateTime.now())
                .status(ParkingStatus.ACTIVE)
                .company(company)
                .staffUser(currentUser)
                .build();

        ParkingSession savedSession = sessionRepository.save(session);
        if (currentUser != null) {
            shiftService.recordCheckIn(currentUser.getId());
        }
        log.info("Check-in successful! Session ID: {}, Slot: {}", savedSession.getId(), allocatedSlot.getSlotNumber());

        return sessionMapper.toCheckInResponse(savedSession);
    }

    @Transactional
    public CheckOutResponse checkOut(CheckOutRequest request) {
        log.info("Processing check-out request for vehicle: '{}', slot: '{}'", request.getVehicleNumber(), request.getSlotNumber());
        User currentUser = getCurrentUser();
        Long companyId = currentUser != null && currentUser.getCompany() != null ? currentUser.getCompany().getId() : null;

        if ((request.getVehicleNumber() == null || request.getVehicleNumber().isBlank()) &&
            (request.getSlotNumber() == null || request.getSlotNumber().isBlank())) {
            throw new BadRequestException("Either vehicle number or slot number must be provided for check-out.");
        }

        // 1. Fetch Active Session by Slot Number or Vehicle Number
        Optional<ParkingSession> activeSessionOpt = Optional.empty();
        if (request.getSlotNumber() != null && !request.getSlotNumber().isBlank()) {
            activeSessionOpt = (companyId != null) ?
                    sessionRepository.findByParkingSlotSlotNumberAndStatusAndCompanyId(request.getSlotNumber().trim(), ParkingStatus.ACTIVE, companyId) :
                    sessionRepository.findByParkingSlotSlotNumberAndStatus(request.getSlotNumber().trim(), ParkingStatus.ACTIVE);
        }
        
        if (activeSessionOpt.isEmpty() && request.getVehicleNumber() != null && !request.getVehicleNumber().isBlank()) {
            activeSessionOpt = (companyId != null) ?
                    sessionRepository.findByVehicleVehicleNumberAndStatusAndCompanyId(request.getVehicleNumber().trim(), ParkingStatus.ACTIVE, companyId) :
                    sessionRepository.findByVehicleVehicleNumberAndStatus(request.getVehicleNumber().trim(), ParkingStatus.ACTIVE);
        }

        ParkingSession session = activeSessionOpt.orElseThrow(() -> new ResourceNotFoundException("No ACTIVE parking session found for the specified vehicle or slot."));

        LocalDateTime exitTime = LocalDateTime.now();
        long minutes = Duration.between(session.getEntryTime(), exitTime).toMinutes();
        if (minutes < 1) {
            minutes = 1;
        }

        // 2. Fee Calculation
        BigDecimal fee = feeCalculator.calculateFee(session.getVehicle().getVehicleType(), session.getEntryTime(), exitTime);

        // 3. Update Session Status
        session.setExitTime(exitTime);
        session.setDurationMinutes((int) minutes);
        session.setParkingFee(fee);
        session.setStatus(ParkingStatus.COMPLETED);

        // 4. Release Parking Slot
        ParkingSlot slot = session.getParkingSlot();
        slot.setStatus(SlotStatus.AVAILABLE);
        slotRepository.save(slot);

        ParkingSession updatedSession = sessionRepository.save(session);

        // 5. Generate Proof of Receipt
        String receiptNumber = generateReceiptNumber(updatedSession.getId());
        Receipt receipt = Receipt.builder()
                .receiptNumber(receiptNumber)
                .parkingSession(updatedSession)
                .generatedTime(exitTime)
                .amount(fee)
                .build();
        receiptRepository.save(receipt);

        if (currentUser != null) {
            shiftService.recordCheckOut(currentUser.getId(), fee);
        }

        log.info("Check-out successful! Vehicle: {}, Fee: ₹{}, Receipt: {}", request.getVehicleNumber(), fee, receiptNumber);

        CheckOutResponse response = sessionMapper.toCheckOutResponse(updatedSession);
        response.setReceiptNumber(receiptNumber);
        return response;
    }

    @Transactional(readOnly = true)
    public Page<CheckInResponse> getActiveSessions(Pageable pageable) {
        User currentUser = getCurrentUser();
        Long companyId = currentUser != null && currentUser.getCompany() != null ? currentUser.getCompany().getId() : null;
        boolean isAdmin = currentUser != null && currentUser.getRoles().stream().anyMatch(r -> r.getName() == RoleType.ROLE_ADMIN);

        if (companyId == null) {
            return sessionRepository.findByStatusOrderByEntryTimeDesc(ParkingStatus.ACTIVE, pageable)
                    .map(sessionMapper::toCheckInResponse);
        }
        if (isAdmin) {
            return sessionRepository.findByStatusAndCompanyIdOrderByEntryTimeDesc(ParkingStatus.ACTIVE, companyId, pageable)
                    .map(sessionMapper::toCheckInResponse);
        } else {
            Long staffId = currentUser != null ? currentUser.getId() : null;
            return sessionRepository.findByStatusAndCompanyIdAndStaffUserIdOrderByEntryTimeDesc(ParkingStatus.ACTIVE, companyId, staffId, pageable)
                    .map(sessionMapper::toCheckInResponse);
        }
    }

    @Transactional(readOnly = true)
    public Page<CheckOutResponse> getParkingHistory(String vehicleNumber, ParkingStatus status, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        User currentUser = getCurrentUser();
        Long companyId = currentUser != null && currentUser.getCompany() != null ? currentUser.getCompany().getId() : null;
        boolean isAdmin = currentUser == null || currentUser.getRoles().stream().anyMatch(r -> r.getName() == RoleType.ROLE_ADMIN);
        Long staffId = isAdmin ? null : currentUser.getId();

        return sessionRepository.filterHistoryScoped(companyId, staffId, vehicleNumber, status, startDate, endDate, pageable)
                .map(session -> {
                    CheckOutResponse resp = sessionMapper.toCheckOutResponse(session);
                    receiptRepository.findByParkingSessionId(session.getId())
                            .ifPresent(r -> resp.setReceiptNumber(r.getReceiptNumber()));
                    return resp;
                });
    }

    @Transactional(readOnly = true)
    public CheckOutResponse getSessionDetails(Long sessionId) {
        ParkingSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("ParkingSession", "id", sessionId));

        CheckOutResponse response = sessionMapper.toCheckOutResponse(session);
        receiptRepository.findByParkingSessionId(session.getId())
                .ifPresent(r -> response.setReceiptNumber(r.getReceiptNumber()));

        return response;
    }

    private String generateReceiptNumber(Long sessionId) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return String.format("RCPT-%s-%05d", timestamp, sessionId);
    }
}
