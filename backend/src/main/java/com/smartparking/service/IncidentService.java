package com.smartparking.service;

import com.smartparking.dto.IncidentRequest;
import com.smartparking.dto.IncidentResponse;
import com.smartparking.entity.Company;
import com.smartparking.entity.Incident;
import com.smartparking.entity.ParkingSlot;
import com.smartparking.entity.User;
import com.smartparking.enums.IncidentPriority;
import com.smartparking.enums.IncidentStatus;
import com.smartparking.exception.ResourceNotFoundException;
import com.smartparking.repository.IncidentRepository;
import com.smartparking.repository.ParkingSlotRepository;
import com.smartparking.repository.UserRepository;
import com.smartparking.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final ParkingSlotRepository slotRepository;

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
    public IncidentResponse reportIncident(IncidentRequest request) {
        User reporter = getCurrentUser();
        if (reporter == null) {
            throw new ResourceNotFoundException("User", "authentication", "Anonymous");
        }

        Company company = reporter.getCompany();
        ParkingSlot slot = request.getSlotId() != null ?
                slotRepository.findById(request.getSlotId()).orElse(null) : null;

        String incidentNo = "INC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Incident incident = Incident.builder()
                .incidentNumber(incidentNo)
                .company(company)
                .reportedByUser(reporter)
                .slot(slot)
                .vehicleNumber(request.getVehicleNumber())
                .type(request.getType())
                .priority(request.getPriority() != null ? request.getPriority() : IncidentPriority.MEDIUM)
                .notes(request.getNotes())
                .status(IncidentStatus.OPEN)
                .build();

        Incident saved = incidentRepository.save(incident);
        log.info("Incident {} reported by user {}", incidentNo, reporter.getUsername());
        return mapToResponse(saved);
    }

    @Transactional
    public IncidentResponse resolveIncident(Long incidentId, String adminNotes) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident", "id", incidentId));

        incident.setStatus(IncidentStatus.RESOLVED);
        incident.setAdminNotes(adminNotes);
        incident.setResolvedAt(LocalDateTime.now());

        Incident updated = incidentRepository.save(incident);
        return mapToResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<IncidentResponse> getCompanyIncidents() {
        User user = getCurrentUser();
        Long companyId = user != null && user.getCompany() != null ? user.getCompany().getId() : 1L;

        return incidentRepository.findByCompanyIdOrderByCreatedAtDesc(companyId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private IncidentResponse mapToResponse(Incident incident) {
        return IncidentResponse.builder()
                .id(incident.getId())
                .incidentNumber(incident.getIncidentNumber())
                .reportedByUsername(incident.getReportedByUser().getUsername())
                .reportedByFullName(incident.getReportedByUser().getFullName())
                .slotNumber(incident.getSlot() != null ? incident.getSlot().getSlotNumber() : null)
                .vehicleNumber(incident.getVehicleNumber())
                .type(incident.getType())
                .priority(incident.getPriority())
                .notes(incident.getNotes())
                .status(incident.getStatus())
                .adminNotes(incident.getAdminNotes())
                .createdAt(incident.getCreatedAt())
                .resolvedAt(incident.getResolvedAt())
                .build();
    }
}
