package com.smartparking.service;

import com.smartparking.dto.WatchlistDTO;
import com.smartparking.entity.Company;
import com.smartparking.entity.User;
import com.smartparking.entity.VehicleWatchlist;
import com.smartparking.enums.WatchlistCategory;
import com.smartparking.exception.ConflictException;
import com.smartparking.exception.ResourceNotFoundException;
import com.smartparking.repository.UserRepository;
import com.smartparking.repository.VehicleWatchlistRepository;
import com.smartparking.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WatchlistService {

    private final VehicleWatchlistRepository watchlistRepository;
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
    public WatchlistDTO addToWatchlist(WatchlistDTO dto) {
        User user = getCurrentUser();
        Company company = user != null ? user.getCompany() : null;
        Long companyId = company != null ? company.getId() : 1L;

        if (watchlistRepository.existsByCompanyIdAndVehicleNumber(companyId, dto.getVehicleNumber())) {
            throw new ConflictException("Vehicle '" + dto.getVehicleNumber() + "' is already on your watchlist");
        }

        VehicleWatchlist entry = VehicleWatchlist.builder()
                .company(company)
                .vehicleNumber(dto.getVehicleNumber())
                .category(dto.getCategory() != null ? dto.getCategory() : WatchlistCategory.BLACK_LISTED)
                .reason(dto.getReason())
                .outstandingDues(dto.getOutstandingDues() != null ? dto.getOutstandingDues() : java.math.BigDecimal.ZERO)
                .build();

        VehicleWatchlist saved = watchlistRepository.save(entry);
        log.info("Vehicle {} added to watchlist with category {}", dto.getVehicleNumber(), dto.getCategory());
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public Optional<WatchlistDTO> checkWatchlist(String vehicleNumber) {
        User user = getCurrentUser();
        Long companyId = user != null && user.getCompany() != null ? user.getCompany().getId() : 1L;

        return watchlistRepository.findByCompanyIdAndVehicleNumber(companyId, vehicleNumber)
                .map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public List<WatchlistDTO> getCompanyWatchlist() {
        User user = getCurrentUser();
        Long companyId = user != null && user.getCompany() != null ? user.getCompany().getId() : 1L;

        return watchlistRepository.findByCompanyIdOrderByCreatedAtDesc(companyId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeFromWatchlist(Long id) {
        watchlistRepository.deleteById(id);
    }

    private WatchlistDTO mapToDTO(VehicleWatchlist entry) {
        return WatchlistDTO.builder()
                .id(entry.getId())
                .vehicleNumber(entry.getVehicleNumber())
                .category(entry.getCategory())
                .reason(entry.getReason())
                .outstandingDues(entry.getOutstandingDues())
                .build();
    }
}
