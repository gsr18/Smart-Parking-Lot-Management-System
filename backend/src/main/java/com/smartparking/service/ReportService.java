package com.smartparking.service;

import com.smartparking.dto.ReportResponse;
import com.smartparking.dto.RevenueSummaryResponse;
import com.smartparking.entity.User;
import com.smartparking.enums.ParkingStatus;
import com.smartparking.enums.RoleType;
import com.smartparking.repository.ParkingSessionRepository;
import com.smartparking.repository.UserRepository;
import com.smartparking.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ParkingSessionRepository sessionRepository;
    private final DashboardService dashboardService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        return userRepository.findById(userPrincipal.getId()).orElse(null);
    }

    @Transactional(readOnly = true)
    public ReportResponse generateDailyReport(LocalDate date) {
        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        LocalDateTime startOfDay = targetDate.atStartOfDay();
        LocalDateTime endOfDay = targetDate.atTime(LocalTime.MAX);

        return generateReportForPeriod("Daily", targetDate.toString(), targetDate.toString(), startOfDay, endOfDay);
    }

    @Transactional(readOnly = true)
    public ReportResponse generateWeeklyReport(LocalDate date) {
        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        LocalDate startOfWeek = targetDate.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
        LocalDate endOfWeek = targetDate.with(TemporalAdjusters.nextOrSame(java.time.DayOfWeek.SUNDAY));

        LocalDateTime start = startOfWeek.atStartOfDay();
        LocalDateTime end = endOfWeek.atTime(LocalTime.MAX);

        return generateReportForPeriod("Weekly", startOfWeek.toString(), endOfWeek.toString(), start, end);
    }

    @Transactional(readOnly = true)
    public ReportResponse generateMonthlyReport(int year, int month) {
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.with(TemporalAdjusters.lastDayOfMonth());

        LocalDateTime start = startOfMonth.atStartOfDay();
        LocalDateTime end = endOfMonth.atTime(LocalTime.MAX);

        String periodName = startOfMonth.format(DateTimeFormatter.ofPattern("MMMM yyyy"));

        return generateReportForPeriod("Monthly (" + periodName + ")", startOfMonth.toString(), endOfMonth.toString(), start, end);
    }

    @Transactional(readOnly = true)
    public RevenueSummaryResponse getRevenueSummary() {
        User currentUser = getCurrentUser();
        Long companyId = currentUser != null && currentUser.getCompany() != null ? currentUser.getCompany().getId() : null;
        boolean isAdmin = currentUser != null && currentUser.getRoles().stream().anyMatch(r -> r.getName() == RoleType.ROLE_ADMIN);
        Long staffId = isAdmin ? null : (currentUser != null ? currentUser.getId() : null);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime startOfWeek = LocalDate.now().with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY)).atStartOfDay();
        LocalDateTime startOfMonth = LocalDate.now().with(TemporalAdjusters.firstDayOfMonth()).atStartOfDay();

        return RevenueSummaryResponse.builder()
                .revenueToday(sessionRepository.calculateRevenueBetweenScoped(startOfDay, now, companyId, staffId))
                .revenueThisWeek(sessionRepository.calculateRevenueBetweenScoped(startOfWeek, now, companyId, staffId))
                .revenueThisMonth(sessionRepository.calculateRevenueBetweenScoped(startOfMonth, now, companyId, staffId))
                .lifetimeRevenue(sessionRepository.calculateTotalLifetimeRevenueScoped(companyId))
                .build();
    }

    private ReportResponse generateReportForPeriod(String periodName, String startDateStr, String endDateStr, LocalDateTime start, LocalDateTime end) {
        User currentUser = getCurrentUser();
        Long companyId = currentUser != null && currentUser.getCompany() != null ? currentUser.getCompany().getId() : null;
        boolean isAdmin = currentUser != null && currentUser.getRoles().stream().anyMatch(r -> r.getName() == RoleType.ROLE_ADMIN);
        Long staffId = isAdmin ? null : (currentUser != null ? currentUser.getId() : null);

        long parkedCount = sessionRepository.countByEntryTimeBetweenAndCompanyId(start, end, companyId);
        long exitedCount = sessionRepository.countByStatusAndCompanyId(ParkingStatus.COMPLETED, companyId);
        BigDecimal totalRevenue = sessionRepository.calculateRevenueBetweenScoped(start, end, companyId, staffId);

        BigDecimal carRev = sessionRepository.calculateRevenueByVehicleTypeAndPeriodScoped(com.smartparking.enums.VehicleType.CAR, start, end, companyId);
        BigDecimal bikeRev = sessionRepository.calculateRevenueByVehicleTypeAndPeriodScoped(com.smartparking.enums.VehicleType.BIKE, start, end, companyId);
        BigDecimal truckRev = sessionRepository.calculateRevenueByVehicleTypeAndPeriodScoped(com.smartparking.enums.VehicleType.TRUCK, start, end, companyId);

        return ReportResponse.builder()
                .reportPeriod(periodName)
                .startDate(startDateStr)
                .endDate(endDateStr)
                .totalParkedVehicles(parkedCount)
                .totalExitedVehicles(exitedCount)
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .carRevenue(carRev != null ? carRev : BigDecimal.ZERO)
                .bikeRevenue(bikeRev != null ? bikeRev : BigDecimal.ZERO)
                .truckRevenue(truckRev != null ? truckRev : BigDecimal.ZERO)
                .averageDurationMinutes(0.0)
                .vehicleDistribution(dashboardService.getVehicleDistribution())
                .build();
    }
}
