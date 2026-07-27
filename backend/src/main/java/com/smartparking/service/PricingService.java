package com.smartparking.service;

import com.smartparking.dto.PricingPolicyDTO;
import com.smartparking.entity.Company;
import com.smartparking.entity.PricingPolicy;
import com.smartparking.entity.User;
import com.smartparking.enums.SlotType;
import com.smartparking.repository.CompanyRepository;
import com.smartparking.repository.PricingPolicyRepository;
import com.smartparking.repository.UserRepository;
import com.smartparking.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class PricingService {

    private final PricingPolicyRepository pricingPolicyRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

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
    public PricingPolicy getOrCreatePolicy(Company company) {
        if (company == null) {
            company = companyRepository.findById(1L).orElseGet(() ->
                companyRepository.save(Company.builder().id(1L).name("SmartParking Enterprise").companyCode("COMP-DEFAULT-001").build())
            );
        }
        final Company targetCompany = company;

        return pricingPolicyRepository.findByCompanyId(targetCompany.getId())
                .orElseGet(() -> pricingPolicyRepository.save(
                        PricingPolicy.builder()
                                .company(targetCompany)
                                .carHourlyRate(new BigDecimal("50.00"))
                                .bikeHourlyRate(new BigDecimal("20.00"))
                                .truckHourlyRate(new BigDecimal("120.00"))
                                .peakMultiplier(new BigDecimal("1.20"))
                                .weekendMultiplier(new BigDecimal("1.15"))
                                .lostTicketFee(new BigDecimal("500.00"))
                                .peakStartHour(18)
                                .peakEndHour(22)
                                .build()
                ));
    }

    @Transactional(readOnly = true)
    public PricingPolicyDTO getCompanyPolicy() {
        User user = getCurrentUser();
        Company company = user != null ? user.getCompany() : null;
        PricingPolicy policy = getOrCreatePolicy(company);

        return PricingPolicyDTO.builder()
                .carHourlyRate(policy.getCarHourlyRate())
                .bikeHourlyRate(policy.getBikeHourlyRate())
                .truckHourlyRate(policy.getTruckHourlyRate())
                .peakMultiplier(policy.getPeakMultiplier())
                .weekendMultiplier(policy.getWeekendMultiplier())
                .lostTicketFee(policy.getLostTicketFee())
                .peakStartHour(policy.getPeakStartHour())
                .peakEndHour(policy.getPeakEndHour())
                .build();
    }

    @Transactional
    public PricingPolicyDTO updateCompanyPolicy(PricingPolicyDTO dto) {
        User user = getCurrentUser();
        Company company = user != null ? user.getCompany() : null;
        PricingPolicy policy = getOrCreatePolicy(company);

        if (dto.getCarHourlyRate() != null) policy.setCarHourlyRate(dto.getCarHourlyRate());
        if (dto.getBikeHourlyRate() != null) policy.setBikeHourlyRate(dto.getBikeHourlyRate());
        if (dto.getTruckHourlyRate() != null) policy.setTruckHourlyRate(dto.getTruckHourlyRate());
        if (dto.getPeakMultiplier() != null) policy.setPeakMultiplier(dto.getPeakMultiplier());
        if (dto.getWeekendMultiplier() != null) policy.setWeekendMultiplier(dto.getWeekendMultiplier());
        if (dto.getLostTicketFee() != null) policy.setLostTicketFee(dto.getLostTicketFee());
        if (dto.getPeakStartHour() != null) policy.setPeakStartHour(dto.getPeakStartHour());
        if (dto.getPeakEndHour() != null) policy.setPeakEndHour(dto.getPeakEndHour());

        PricingPolicy updated = pricingPolicyRepository.save(policy);
        log.info("Pricing policy updated for company: {}", company != null ? company.getName() : "Global");

        return getCompanyPolicy();
    }

    @Transactional(readOnly = true)
    public BigDecimal calculateDynamicFee(SlotType slotType, LocalDateTime entryTime, LocalDateTime exitTime, Company company) {
        PricingPolicy policy = getOrCreatePolicy(company);

        BigDecimal baseRate;
        if (slotType == SlotType.BIKE) {
            baseRate = policy.getBikeHourlyRate();
        } else if (slotType == SlotType.TRUCK) {
            baseRate = policy.getTruckHourlyRate();
        } else {
            baseRate = policy.getCarHourlyRate();
        }

        long durationMinutes = java.time.Duration.between(entryTime, exitTime).toMinutes();
        long hours = (long) Math.ceil((double) Math.max(1, durationMinutes) / 60.0);

        BigDecimal fee = baseRate.multiply(BigDecimal.valueOf(hours));

        // Peak Hour multiplier
        int exitHour = exitTime.getHour();
        if (exitHour >= policy.getPeakStartHour() && exitHour < policy.getPeakEndHour()) {
            fee = fee.multiply(policy.getPeakMultiplier());
        }

        // Weekend multiplier
        DayOfWeek day = exitTime.getDayOfWeek();
        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
            fee = fee.multiply(policy.getWeekendMultiplier());
        }

        return fee.setScale(2, RoundingMode.HALF_UP);
    }
}
