package com.smartparking.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartparking.dto.CompanyDTO;
import com.smartparking.dto.LayoutConfigDTO;
import com.smartparking.entity.Company;
import com.smartparking.entity.ParkingSlot;
import com.smartparking.entity.User;
import com.smartparking.enums.ParkingStatus;
import com.smartparking.enums.SlotStatus;
import com.smartparking.enums.SlotType;
import com.smartparking.exception.BadRequestException;
import com.smartparking.repository.CompanyRepository;
import com.smartparking.repository.ParkingSessionRepository;
import com.smartparking.repository.ParkingSlotRepository;
import com.smartparking.repository.UserRepository;
import com.smartparking.security.UserPrincipal;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final ParkingSlotRepository slotRepository;
    private final ParkingSessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @PersistenceContext
    private EntityManager entityManager;

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

    public List<CompanyDTO> getPublicCompanies() {
        return companyRepository.findAll().stream()
                .map(company -> CompanyDTO.builder()
                        .id(company.getId())
                        .name(company.getName())
                        .companyCode(company.getCompanyCode())
                        .layoutConfig(company.getLayoutConfig())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CompanyDTO getMyCompanyLayout() {
        User currentUser = getCurrentUser();
        if (currentUser == null || currentUser.getCompany() == null) {
            throw new BadRequestException("No company associated with the current user.");
        }
        Company company = currentUser.getCompany();
        return CompanyDTO.builder()
                .id(company.getId())
                .name(company.getName())
                .companyCode(company.getCompanyCode())
                .layoutConfig(company.getLayoutConfig())
                .build();
    }

    @Transactional
    public CompanyDTO applyLayoutConfig(LayoutConfigDTO config) {
        User currentUser = getCurrentUser();
        if (currentUser == null || currentUser.getCompany() == null) {
            throw new BadRequestException("No company associated with the current user.");
        }
        Company company = currentUser.getCompany();
        Long companyId = company.getId();

        // Validate floor count
        if (config.getTotalFloors() < 1 || config.getTotalFloors() > 4) {
            throw new BadRequestException("Total floors must be between 1 and 4.");
        }

        // Validate no active sessions exist
        long activeSessions = sessionRepository.countByStatusAndCompanyId(ParkingStatus.ACTIVE, companyId);
        if (activeSessions > 0) {
            throw new BadRequestException(
                "Cannot change layout while " + activeSessions + " vehicle(s) are still parked. " +
                "Please check out all vehicles first."
            );
        }

        // Bulk-delete all existing slots in one JPQL statement, bypassing the 1st-level cache
        // This avoids unique-constraint violations that occur when Hibernate delays the DELETE
        // until after the INSERT in the same transaction.
        int deleted = slotRepository.deleteAllByCompanyId(companyId);
        entityManager.flush(); // force DELETE to hit DB before any INSERT
        entityManager.clear(); // clear 1st-level cache so new saves don't conflict
        log.info("Deleted {} existing slots for company '{}' (bulk JPQL)", deleted, company.getName());

        // Generate new slots from template
        List<ParkingSlot> newSlots = new ArrayList<>();
        Map<Integer, String> floorTemplates = config.getFloorTemplates();

        for (int floor = 1; floor <= config.getTotalFloors(); floor++) {
            String template = floorTemplates != null && floorTemplates.containsKey(floor)
                    ? floorTemplates.get(floor)
                    : "5x5"; // default template

            int[] dims = parseTemplate(template);
            int rows = dims[0];
            int cols = dims[1];
            int totalSlots = rows * cols;

            log.info("Generating {} slots ({}) for floor {} of company '{}'",
                    totalSlots, template, floor, company.getName());

            newSlots.addAll(generateFloorSlots(floor, rows, cols, company));
        }

        slotRepository.saveAll(newSlots);
        log.info("Saved {} new slots for company '{}'", newSlots.size(), company.getName());

        // Persist layout config JSON to company
        try {
            String configJson = objectMapper.writeValueAsString(config);
            company.setLayoutConfig(configJson);
            company = companyRepository.save(company);
        } catch (Exception e) {
            log.error("Failed to serialize layout config", e);
            throw new BadRequestException("Failed to save layout configuration.");
        }

        return CompanyDTO.builder()
                .id(company.getId())
                .name(company.getName())
                .companyCode(company.getCompanyCode())
                .layoutConfig(company.getLayoutConfig())
                .build();
    }

    // Parses "5x5" -> [5, 5], "10x12" -> [10, 12]
    private int[] parseTemplate(String template) {
        try {
            String[] parts = template.toLowerCase().split("x");
            int rows = Integer.parseInt(parts[0].trim());
            int cols = Integer.parseInt(parts[1].trim());
            if (rows < 2 || rows > 20 || cols < 2 || cols > 20) {
                throw new BadRequestException("Template dimensions must be between 2 and 20.");
            }
            return new int[]{rows, cols};
        } catch (NumberFormatException e) {
            throw new BadRequestException("Invalid template format: '" + template + "'. Use format like '5x5' or '10x12'.");
        }
    }

    /**
     * Generates m*n slots for a floor.
     * - Row A (first half rows) → CAR slots
     * - Row B (second half rows) → CAR slots, last 2 cols of last row → BIKE, last 1 col of last row → TRUCK
     */
    private List<ParkingSlot> generateFloorSlots(int floor, int rows, int cols, Company company) {
        List<ParkingSlot> slots = new ArrayList<>();
        String[] rowLabels = {"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T"};

        int totalSlots = rows * cols;
        int slotIndex = 0;

        for (int r = 0; r < rows; r++) {
            String rowLabel = rowLabels[r % rowLabels.length];
            for (int c = 1; c <= cols; c++) {
                slotIndex++;
                int globalIndex = slotIndex;
                // Last 10% of slots (min 1) → TRUCK, prior 15% → BIKE, rest → CAR
                SlotType type;
                if (globalIndex > totalSlots - Math.max(1, totalSlots / 10)) {
                    type = SlotType.TRUCK;
                } else if (globalIndex > totalSlots - Math.max(1, totalSlots / 10) - Math.max(1, totalSlots / 7)) {
                    type = SlotType.BIKE;
                } else {
                    type = SlotType.CAR;
                }

                // Prefix slot number with company ID to ensure global uniqueness across tenants
                // Format: C{companyId}-{rowLabel}-F{floor}-{col:02d}  e.g.  C1-A-F1-01
                String slotNumber = "C" + company.getId() + "-" + rowLabel + "-F" + floor + "-" + String.format("%02d", c);
                slots.add(ParkingSlot.builder()
                        .slotNumber(slotNumber)
                        .slotType(type)
                        .floorNumber(floor)
                        .status(SlotStatus.AVAILABLE)
                        .company(company)
                        .build());
            }
        }
        return slots;
    }
}
