package com.smartparking.service;

import com.smartparking.dto.VehicleRequest;
import com.smartparking.dto.VehicleResponse;
import com.smartparking.entity.Company;
import com.smartparking.entity.ParkingSession;
import com.smartparking.entity.User;
import com.smartparking.entity.Vehicle;
import com.smartparking.enums.ParkingStatus;
import com.smartparking.exception.ConflictException;
import com.smartparking.exception.ResourceNotFoundException;
import com.smartparking.mapper.VehicleMapper;
import com.smartparking.repository.ParkingSessionRepository;
import com.smartparking.repository.UserRepository;
import com.smartparking.repository.VehicleRepository;
import com.smartparking.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final ParkingSessionRepository parkingSessionRepository;
    private final UserRepository userRepository;
    private final VehicleMapper vehicleMapper;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        return userRepository.findById(userPrincipal.getId()).orElse(null);
    }

    @Transactional
    public VehicleResponse registerVehicle(VehicleRequest request) {
        User currentUser = getCurrentUser();
        Company company = currentUser != null ? currentUser.getCompany() : null;
        Long companyId = company != null ? company.getId() : null;

        log.info("Registering vehicle with number: {} for company: {}", request.getVehicleNumber(), company != null ? company.getName() : "Global");

        if (vehicleRepository.existsByVehicleNumberAndCompanyId(request.getVehicleNumber(), companyId)) {
            throw new ConflictException("Vehicle with registration number '" + request.getVehicleNumber() + "' is already registered in your company");
        }

        Vehicle vehicle = vehicleMapper.toEntity(request);
        vehicle.setCompany(company);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        log.info("Successfully registered vehicle with ID: {}", savedVehicle.getId());
        return enrichResponse(vehicleMapper.toResponse(savedVehicle), companyId);
    }

    @Transactional(readOnly = true)
    public Page<VehicleResponse> getAllVehicles(Pageable pageable) {
        User currentUser = getCurrentUser();
        Long companyId = currentUser != null && currentUser.getCompany() != null ? currentUser.getCompany().getId() : null;

        return vehicleRepository.searchVehiclesScoped("", companyId, pageable)
                .map(vehicleMapper::toResponse)
                .map(res -> enrichResponse(res, companyId));
    }

    @Transactional(readOnly = true)
    public VehicleResponse getVehicleByNumber(String vehicleNumber) {
        User currentUser = getCurrentUser();
        Long companyId = currentUser != null && currentUser.getCompany() != null ? currentUser.getCompany().getId() : null;

        Vehicle vehicle = vehicleRepository.findByVehicleNumberAndCompanyId(vehicleNumber, companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "vehicleNumber", vehicleNumber));

        return enrichResponse(vehicleMapper.toResponse(vehicle), companyId);
    }

    @Transactional(readOnly = true)
    public Page<VehicleResponse> searchVehicles(String query, Pageable pageable) {
        User currentUser = getCurrentUser();
        Long companyId = currentUser != null && currentUser.getCompany() != null ? currentUser.getCompany().getId() : null;

        return vehicleRepository.searchVehiclesScoped(query != null ? query : "", companyId, pageable)
                .map(vehicleMapper::toResponse)
                .map(res -> enrichResponse(res, companyId));
    }

    private VehicleResponse enrichResponse(VehicleResponse response, Long companyId) {
        Optional<ParkingSession> activeSession = parkingSessionRepository
                .findByVehicleVehicleNumberAndStatusAndCompanyId(response.getVehicleNumber(), ParkingStatus.ACTIVE, companyId);

        if (activeSession.isPresent()) {
            response.setCurrentlyParked(true);
            response.setActiveSlotNumber(activeSession.get().getParkingSlot().getSlotNumber());
        } else {
            response.setCurrentlyParked(false);
            response.setActiveSlotNumber(null);
        }
        return response;
    }
}
