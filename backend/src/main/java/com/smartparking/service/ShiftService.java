package com.smartparking.service;

import com.smartparking.dto.ShiftRequest;
import com.smartparking.dto.ShiftResponse;
import com.smartparking.entity.Company;
import com.smartparking.entity.Shift;
import com.smartparking.entity.User;
import com.smartparking.enums.ParkingStatus;
import com.smartparking.enums.RoleType;
import com.smartparking.enums.ShiftStatus;
import com.smartparking.exception.ConflictException;
import com.smartparking.exception.ResourceNotFoundException;
import com.smartparking.repository.ParkingSessionRepository;
import com.smartparking.repository.ShiftRepository;
import com.smartparking.repository.UserRepository;
import com.smartparking.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShiftService {

    private final ShiftRepository shiftRepository;
    private final UserRepository userRepository;
    private final ParkingSessionRepository sessionRepository;

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
    public ShiftResponse startShift(ShiftRequest request) {
        User user = getCurrentUser();
        if (user == null) {
            throw new ResourceNotFoundException("User", "authentication", "Anonymous");
        }

        Optional<Shift> existing = shiftRepository.findByUserIdAndStatus(user.getId(), ShiftStatus.ACTIVE);
        if (existing.isPresent()) {
            throw new ConflictException("You already have an active shift running since " + existing.get().getStartTime());
        }

        Company company = user.getCompany();
        Shift shift = Shift.builder()
                .user(user)
                .company(company)
                .startTime(LocalDateTime.now())
                .status(ShiftStatus.ACTIVE)
                .notes(request != null ? request.getNotes() : null)
                .build();

        Shift saved = shiftRepository.save(shift);
        log.info("Shift ID {} started for staff: {}", saved.getId(), user.getUsername());
        return mapToResponse(saved);
    }

    @Transactional
    public ShiftResponse endShift(ShiftRequest request) {
        User user = getCurrentUser();
        if (user == null) {
            throw new ResourceNotFoundException("User", "authentication", "Anonymous");
        }

        Shift shift = shiftRepository.findByUserIdAndStatus(user.getId(), ShiftStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Shift", "status", "ACTIVE"));

        shift.setEndTime(LocalDateTime.now());
        shift.setStatus(ShiftStatus.ENDED);
        if (request != null && request.getNotes() != null) {
            shift.setNotes(request.getNotes());
        }

        Shift saved = shiftRepository.save(shift);
        log.info("Shift ID {} ended for staff: {}", saved.getId(), user.getUsername());
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public ShiftResponse getActiveShift() {
        User user = getCurrentUser();
        if (user == null) return null;

        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName() == RoleType.ROLE_ADMIN);
        Long companyId = user.getCompany() != null ? user.getCompany().getId() : null;

        Optional<Shift> activeOpt = shiftRepository.findByUserIdAndStatus(user.getId(), ShiftStatus.ACTIVE);

        if (isAdmin) {
            LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
            LocalDateTime now = LocalDateTime.now();

            long todayCheckins = sessionRepository.countByEntryTimeBetweenAndCompanyId(startOfDay, now, companyId);
            long todayCheckouts = sessionRepository.countByStatusAndCompanyId(ParkingStatus.COMPLETED, companyId);
            BigDecimal todayRevenue = sessionRepository.calculateRevenueBetweenScoped(startOfDay, now, companyId, null);

            LocalDateTime startTime = activeOpt.map(Shift::getStartTime).orElse(startOfDay);

            return ShiftResponse.builder()
                    .id(activeOpt.map(Shift::getId).orElse(-1L))
                    .userId(user.getId())
                    .staffUsername(user.getUsername())
                    .staffFullName(user.getFullName())
                    .startTime(startTime)
                    .status(ShiftStatus.ACTIVE)
                    .checkinsCount((int) todayCheckins)
                    .checkoutsCount((int) todayCheckouts)
                    .revenueCollected(todayRevenue != null ? todayRevenue : BigDecimal.ZERO)
                    .notes(activeOpt.map(Shift::getNotes).orElse(null))
                    .build();
        }

        return activeOpt.map(this::mapToResponse).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<ShiftResponse> getCompanyShifts() {
        User user = getCurrentUser();
        Long companyId = user != null && user.getCompany() != null ? user.getCompany().getId() : 1L;

        return shiftRepository.findByCompanyIdOrderByStartTimeDesc(companyId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void recordCheckIn(Long userId) {
        if (userId == null) return;
        shiftRepository.findByUserIdAndStatus(userId, ShiftStatus.ACTIVE).ifPresent(shift -> {
            shift.setCheckinsCount(shift.getCheckinsCount() + 1);
            shiftRepository.save(shift);
        });
    }

    @Transactional
    public void recordCheckOut(Long userId, BigDecimal fee) {
        if (userId == null) return;
        shiftRepository.findByUserIdAndStatus(userId, ShiftStatus.ACTIVE).ifPresent(shift -> {
            shift.setCheckoutsCount(shift.getCheckoutsCount() + 1);
            if (fee != null) {
                shift.setRevenueCollected(shift.getRevenueCollected().add(fee));
            }
            shiftRepository.save(shift);
        });
    }

    private ShiftResponse mapToResponse(Shift shift) {
        return ShiftResponse.builder()
                .id(shift.getId())
                .userId(shift.getUser().getId())
                .staffUsername(shift.getUser().getUsername())
                .staffFullName(shift.getUser().getFullName())
                .startTime(shift.getStartTime())
                .endTime(shift.getEndTime())
                .status(shift.getStatus())
                .checkinsCount(shift.getCheckinsCount())
                .checkoutsCount(shift.getCheckoutsCount())
                .revenueCollected(shift.getRevenueCollected())
                .notes(shift.getNotes())
                .build();
    }
}
