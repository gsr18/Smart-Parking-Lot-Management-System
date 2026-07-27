package com.smartparking.service;

import com.smartparking.dto.SlotRequest;
import com.smartparking.dto.SlotResponse;
import com.smartparking.entity.Company;
import com.smartparking.entity.ParkingSession;
import com.smartparking.entity.ParkingSlot;
import com.smartparking.entity.User;
import com.smartparking.enums.ParkingStatus;
import com.smartparking.enums.SlotStatus;
import com.smartparking.enums.SlotType;
import com.smartparking.exception.ConflictException;
import com.smartparking.exception.InvalidOperationException;
import com.smartparking.exception.ResourceNotFoundException;
import com.smartparking.mapper.SlotMapper;
import com.smartparking.repository.CompanyRepository;
import com.smartparking.repository.ParkingSessionRepository;
import com.smartparking.repository.ParkingSlotRepository;
import com.smartparking.repository.UserRepository;
import com.smartparking.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SlotService {

    private final ParkingSlotRepository slotRepository;
    private final ParkingSessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final SlotMapper slotMapper;

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

    private void ensureCompanySlotsProvisioned(Company company) {
        if (company == null) return;
        long existingSlots = slotRepository.countByCompanyId(company.getId());
        if (existingSlots > 0) return;

        log.info("Provisioning initial 36 parking slots for company '{}' (ID: {})", company.getName(), company.getId());
        List<ParkingSlot> defaultSlots = new ArrayList<>();

        for (int floor = 1; floor <= 3; floor++) {
            for (int i = 1; i <= 12; i++) {
                String rowLabel = (i <= 6) ? "A" : "B";
                // Use company-scoped format: C{companyId}-{row}-F{floor}-{col:02d}
                String slotNumber = "C" + company.getId() + "-" + rowLabel + "-F" + floor + "-" + String.format("%02d", i);

                SlotType type = SlotType.CAR;
                if (i == 11 || i == 12) {
                    type = SlotType.BIKE;
                }

                defaultSlots.add(ParkingSlot.builder()
                        .slotNumber(slotNumber)
                        .slotType(type)
                        .floorNumber(floor)
                        .status(SlotStatus.AVAILABLE)
                        .company(company)
                        .build());
            }
        }
        slotRepository.saveAll(defaultSlots);
    }

    @Transactional
    public SlotResponse createSlot(SlotRequest request) {
        User currentUser = getCurrentUser();
        Company company = currentUser != null ? currentUser.getCompany() : null;
        Long companyId = company != null ? company.getId() : null;

        log.info("Creating parking slot: {} for company: {}", request.getSlotNumber(), company != null ? company.getName() : "Global");

        if (slotRepository.existsBySlotNumberAndCompanyId(request.getSlotNumber(), companyId)) {
            throw new ConflictException("Parking slot '" + request.getSlotNumber() + "' already exists in your company");
        }

        ParkingSlot slot = slotMapper.toEntity(request);
        slot.setCompany(company);
        ParkingSlot savedSlot = slotRepository.save(slot);

        log.info("Successfully created slot with ID: {}", savedSlot.getId());
        return enrichResponse(slotMapper.toResponse(savedSlot), companyId);
    }

    @Transactional
    public SlotResponse updateSlot(Long id, SlotRequest request) {
        User currentUser = getCurrentUser();
        Long companyId = currentUser != null && currentUser.getCompany() != null ? currentUser.getCompany().getId() : null;

        ParkingSlot slot = slotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ParkingSlot", "id", id));

        if (!slot.getSlotNumber().equals(request.getSlotNumber()) &&
            slotRepository.existsBySlotNumberAndCompanyId(request.getSlotNumber(), companyId)) {
            throw new ConflictException("Parking slot '" + request.getSlotNumber() + "' already exists in your company");
        }

        if (slot.getStatus() == SlotStatus.OCCUPIED && request.getStatus() == SlotStatus.DISABLED) {
            throw new InvalidOperationException("Cannot disable slot '" + slot.getSlotNumber() + "' while it is currently occupied");
        }

        slot.setSlotNumber(request.getSlotNumber());
        slot.setSlotType(request.getSlotType());
        slot.setFloorNumber(request.getFloorNumber());
        if (request.getStatus() != null) {
            slot.setStatus(request.getStatus());
        }

        ParkingSlot updatedSlot = slotRepository.save(slot);
        return enrichResponse(slotMapper.toResponse(updatedSlot), companyId);
    }

    @Transactional
    public SlotResponse disableSlot(Long id) {
        User currentUser = getCurrentUser();
        Long companyId = currentUser != null && currentUser.getCompany() != null ? currentUser.getCompany().getId() : null;

        ParkingSlot slot = slotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ParkingSlot", "id", id));

        if (slot.getStatus() == SlotStatus.OCCUPIED) {
            throw new InvalidOperationException("Cannot disable slot '" + slot.getSlotNumber() + "' while it is occupied by a parked vehicle");
        }

        slot.setStatus(SlotStatus.DISABLED);
        ParkingSlot updatedSlot = slotRepository.save(slot);
        log.info("Disabled slot: {}", slot.getSlotNumber());
        return enrichResponse(slotMapper.toResponse(updatedSlot), companyId);
    }

    @Transactional
    public SlotResponse enableSlot(Long id) {
        User currentUser = getCurrentUser();
        Long companyId = currentUser != null && currentUser.getCompany() != null ? currentUser.getCompany().getId() : null;

        ParkingSlot slot = slotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ParkingSlot", "id", id));

        slot.setStatus(SlotStatus.AVAILABLE);
        ParkingSlot updatedSlot = slotRepository.save(slot);
        log.info("Enabled slot: {}", slot.getSlotNumber());
        return enrichResponse(slotMapper.toResponse(updatedSlot), companyId);
    }

    @Transactional
    public List<SlotResponse> getAllSlots() {
        User currentUser = getCurrentUser();
        Company company = (currentUser != null && currentUser.getCompany() != null) ?
                currentUser.getCompany() :
                companyRepository.findById(1L).orElse(null);

        if (company != null) {
            ensureCompanySlotsProvisioned(company);
        }

        Long companyId = company != null ? company.getId() : null;
        List<ParkingSlot> slots = (companyId != null) ?
                slotRepository.findByCompanyId(companyId) :
                slotRepository.findAll();

        return slots.stream()
                .map(slotMapper::toResponse)
                .map(res -> enrichResponse(res, companyId))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<SlotResponse> getAvailableSlots(SlotType slotType) {
        User currentUser = getCurrentUser();
        Company company = (currentUser != null && currentUser.getCompany() != null) ?
                currentUser.getCompany() :
                companyRepository.findById(1L).orElse(null);

        if (company != null) {
            ensureCompanySlotsProvisioned(company);
        }

        Long companyId = company != null ? company.getId() : null;

        List<ParkingSlot> slots = (slotType == null) ?
                slotRepository.findByStatusAndCompanyId(SlotStatus.AVAILABLE, companyId) :
                slotRepository.findBySlotTypeAndStatusAndCompanyId(slotType, SlotStatus.AVAILABLE, companyId);

        return slots.stream()
                .map(slotMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<SlotResponse> getSlotsByFloor(Integer floorNumber) {
        User currentUser = getCurrentUser();
        Company company = (currentUser != null && currentUser.getCompany() != null) ?
                currentUser.getCompany() :
                companyRepository.findById(1L).orElse(null);

        if (company != null) {
            ensureCompanySlotsProvisioned(company);
        }

        Long companyId = company != null ? company.getId() : null;

        List<ParkingSlot> slots = (companyId != null) ?
                slotRepository.findByFloorNumberAndCompanyIdOrderBySlotNumberAsc(floorNumber, companyId) :
                slotRepository.findByFloorNumberOrderBySlotNumberAsc(floorNumber);

        return slots.stream()
                .map(slotMapper::toResponse)
                .map(res -> enrichResponse(res, companyId))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<Integer> getFloorNumbers() {
        User currentUser = getCurrentUser();
        Company company = (currentUser != null && currentUser.getCompany() != null) ?
                currentUser.getCompany() :
                companyRepository.findById(1L).orElse(null);

        if (company != null) {
            ensureCompanySlotsProvisioned(company);
        }

        Long companyId = company != null ? company.getId() : null;
        return slotRepository.findDistinctFloorNumbers(companyId);
    }

    private SlotResponse enrichResponse(SlotResponse response, Long companyId) {
        if (response.getStatus() == SlotStatus.OCCUPIED) {
            Optional<ParkingSession> activeSession = sessionRepository
                    .findByParkingSlotSlotNumberAndStatusAndCompanyId(response.getSlotNumber(), ParkingStatus.ACTIVE, companyId);

            if (activeSession.isPresent()) {
                response.setOccupiedByVehicleNumber(activeSession.get().getVehicle().getVehicleNumber());
                response.setCurrentOwnerName(activeSession.get().getOwnerName());
            }
        }
        return response;
    }
}
