package com.smartparking.service;

import com.smartparking.dto.DashboardSummaryResponse;
import com.smartparking.dto.RecentActivityResponse;
import com.smartparking.dto.VehicleDistributionResponse;
import com.smartparking.entity.ParkingSession;
import com.smartparking.entity.User;
import com.smartparking.enums.ParkingStatus;
import com.smartparking.enums.RoleType;
import com.smartparking.enums.SlotStatus;
import com.smartparking.enums.VehicleType;
import com.smartparking.mapper.ParkingSessionMapper;
import com.smartparking.repository.ParkingSessionRepository;
import com.smartparking.repository.ParkingSlotRepository;
import com.smartparking.repository.UserRepository;
import com.smartparking.repository.VehicleRepository;
import com.smartparking.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ParkingSlotRepository slotRepository;
    private final ParkingSessionRepository sessionRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final ParkingSessionMapper sessionMapper;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        return userRepository.findById(userPrincipal.getId()).orElse(null);
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardSummary() {
        User currentUser = getCurrentUser();
        Long companyId = currentUser != null && currentUser.getCompany() != null ? currentUser.getCompany().getId() : null;
        boolean isAdmin = currentUser != null && currentUser.getRoles().stream().anyMatch(r -> r.getName() == RoleType.ROLE_ADMIN);
        Long staffId = isAdmin ? null : (currentUser != null ? currentUser.getId() : null);

        long totalSlots = slotRepository.countByCompanyId(companyId);
        long availableSlots = slotRepository.countByStatusAndCompanyId(SlotStatus.AVAILABLE, companyId);
        long occupiedSlots = slotRepository.countByStatusAndCompanyId(SlotStatus.OCCUPIED, companyId);
        long disabledSlots = slotRepository.countByStatusAndCompanyId(SlotStatus.DISABLED, companyId);

        long enabledSlots = totalSlots - disabledSlots;
        double occupancyPercentage = (enabledSlots > 0) ? ((double) occupiedSlots / enabledSlots) * 100.0 : 0.0;

        long activeSessions = isAdmin ?
                sessionRepository.countByStatusAndCompanyId(ParkingStatus.ACTIVE, companyId) :
                sessionRepository.countByStatusAndCompanyIdAndStaffUserId(ParkingStatus.ACTIVE, companyId, staffId);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();

        long vehiclesParkedToday = sessionRepository.countByEntryTimeBetweenAndCompanyId(startOfDay, now, companyId);
        long vehiclesExitedToday = sessionRepository.countByStatusAndCompanyId(ParkingStatus.COMPLETED, companyId);

        BigDecimal revenueToday = sessionRepository.calculateRevenueBetweenScoped(startOfDay, now, companyId, staffId);

        LocalDateTime startOfWeek = LocalDate.now().with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY)).atStartOfDay();
        BigDecimal revenueThisWeek = sessionRepository.calculateRevenueBetweenScoped(startOfWeek, now, companyId, staffId);

        LocalDateTime startOfMonth = LocalDate.now().with(TemporalAdjusters.firstDayOfMonth()).atStartOfDay();
        BigDecimal revenueThisMonth = sessionRepository.calculateRevenueBetweenScoped(startOfMonth, now, companyId, staffId);

        BigDecimal lifetimeRevenue = sessionRepository.calculateTotalLifetimeRevenueScoped(companyId);

        return DashboardSummaryResponse.builder()
                .totalSlots(totalSlots)
                .availableSlots(availableSlots)
                .occupiedSlots(occupiedSlots)
                .disabledSlots(disabledSlots)
                .occupancyPercentage(Math.round(occupancyPercentage * 10.0) / 10.0)
                .activeSessions(activeSessions)
                .vehiclesParkedToday(vehiclesParkedToday)
                .vehiclesExitedToday(vehiclesExitedToday)
                .revenueToday(revenueToday != null ? revenueToday : BigDecimal.ZERO)
                .revenueThisWeek(revenueThisWeek != null ? revenueThisWeek : BigDecimal.ZERO)
                .revenueThisMonth(revenueThisMonth != null ? revenueThisMonth : BigDecimal.ZERO)
                .lifetimeRevenue(lifetimeRevenue != null ? lifetimeRevenue : BigDecimal.ZERO)
                .build();
    }

    @Transactional(readOnly = true)
    public List<RecentActivityResponse> getRecentActivities() {
        User currentUser = getCurrentUser();
        Long companyId = currentUser != null && currentUser.getCompany() != null ? currentUser.getCompany().getId() : null;
        boolean isAdmin = currentUser != null && currentUser.getRoles().stream().anyMatch(r -> r.getName() == RoleType.ROLE_ADMIN);
        Long staffId = isAdmin ? null : (currentUser != null ? currentUser.getId() : null);

        List<ParkingSession> recentSessions = sessionRepository.findRecentActivitiesScoped(companyId, staffId, PageRequest.of(0, 10));
        return recentSessions.stream()
                .map(sessionMapper::toRecentActivityResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VehicleDistributionResponse getVehicleDistribution() {
        User currentUser = getCurrentUser();
        Long companyId = currentUser != null && currentUser.getCompany() != null ? currentUser.getCompany().getId() : null;

        long totalCars = vehicleRepository.countByVehicleTypeAndCompanyId(VehicleType.CAR, companyId);
        long totalBikes = vehicleRepository.countByVehicleTypeAndCompanyId(VehicleType.BIKE, companyId);
        long totalTrucks = vehicleRepository.countByVehicleTypeAndCompanyId(VehicleType.TRUCK, companyId);

        long totalVehicles = totalCars + totalBikes + totalTrucks;

        double carPct = (totalVehicles > 0) ? ((double) totalCars / totalVehicles) * 100.0 : 0.0;
        double bikePct = (totalVehicles > 0) ? ((double) totalBikes / totalVehicles) * 100.0 : 0.0;
        double truckPct = (totalVehicles > 0) ? ((double) totalTrucks / totalVehicles) * 100.0 : 0.0;

        return VehicleDistributionResponse.builder()
                .totalCars(totalCars)
                .totalBikes(totalBikes)
                .totalTrucks(totalTrucks)
                .carPercentage(Math.round(carPct * 10.0) / 10.0)
                .bikePercentage(Math.round(bikePct * 10.0) / 10.0)
                .truckPercentage(Math.round(truckPct * 10.0) / 10.0)
                .build();
    }
}
